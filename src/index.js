const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {removeUser,addUser,getUser,getUsersInRoom}=require('./utils/users')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const app=express()
const server=http.createServer(app)
const port=process.env.PORT||3000
const io=socketio(server)
const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('new websocket connecion')
    socket.on('join',({username,room},callback)=>{
        const {error,user}=addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessage('admin','Welcome'))
    socket.broadcast.to(user.room).emit('message',generateMessage('admin',`${user.username} has joined`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
    callback()
    })
    socket.on('sendMessage',(message,callback)=>{
        user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
      
        callback()
    })
    socket.on('disconnect',()=>{
        user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage('admin',`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })
    socket.on('sendLocation',(coords,callback)=>{
        user=getUser(socket.id)
        io.to(user.room).emit('Locationmessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    
        callback('✔')
    })
})

server.listen(port,()=>{
    console.log(`server is up on port ${port} !`)
    
})