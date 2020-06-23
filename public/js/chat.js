const $messageForm=document.querySelector('#message-form')
const  $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocation=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

const socket=io()
autoscroll=()=>{
    //new Message element
   
    const $newMessage=$messages.lastElementChild
    //height of new message
    const newMessageStyles=getComputedStyle($newMessage)
    newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
    
    //visible height
    const visibleHeight=$messages.offsetHeight
 
    //height of message  container
    const containerHeight=$messages.scrollHeight
    //How far have iscrolled?
    const scrollOffset=$messages.scrollTop+visibleHeight
    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
 
    }
 }
//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const LocationmessageTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
//options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('Locationmessage',(url)=>{
    console.log(url)
    const html=Mustache.render(LocationmessageTemplate,{
        name:url.username,
        url:url.link,
        createdAt:moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    
})
socket.on('roomData',({room,users})=>{
     const html=Mustache.render(sidebarTemplate,{
         room,users
     })
     document.querySelector('#sidebar').innerHTML=html
})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const message=e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('✔')
    })
})

$sendLocation.addEventListener('click',()=>{
   
    if (!navigator.geolocation||navigator.geolocation=={}){
        return alert('Geolocation is not supported by your browser')
    }
    console.log(navigator.geolocation)
    $sendLocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
        },(m)=>{
            $sendLocation.removeAttribute('disabled')
            console.log('location shared ',m)
        })
       
    })
   
 
})
socket.emit('join',{username,room},(error)=>{
   if(error){
   alert(error)
   location.href='/'}
})