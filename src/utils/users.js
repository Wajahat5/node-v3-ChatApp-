const users=[]
const removeUser=(id)=>{
    const index=users.findIndex((user)=> user.id===id)
    if(index!=-1){
        return users.splice(index,1)[0]
    }
}
const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    //validate the data
    if(!username||!room){
        return {
            error:'username and room required'
        }
    }
    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })
    if(existingUser){
        return {
            error:'Username is in use!'
        }
    }
    const user={id,username,room}
    users.push(user)
    return {user}
}
const getUser=(id)=>{
    const index=users.findIndex((user)=> user.id===id)
    return users[index]
}
const getUsersInRoom=(room)=>{
    const UsersInRoom=users.filter((user)=>{
        return user.room===room
    })
    return UsersInRoom
}
module.exports={
    removeUser,
    addUser,
    getUser,
    getUsersInRoom
}