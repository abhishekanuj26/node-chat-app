var socket=io();
socket.on('connect',function(){
    console.log('connected to the server');
    socket.emit('createMessage',{
        to:'abhishek',
        text:'hello',
        at:'1.22'
    });
});
socket.on('disconnect',function(){
    console.log('disconnected');
});
socket.on('newMessage',function(message){
    console.log('new message',message);
});