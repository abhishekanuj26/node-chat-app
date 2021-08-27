const path=require('path');
const express=require('express');
const http=require('http');
const socketIo=require('socket.io');
const {messageGenerator}=require('./utils/message')
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);
var io=socketIo(server);
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('new user connected');
    socket.emit('newMessage',messageGenerator('admin','welcome to live-chat app'));
    socket.broadcast.emit('newMessage',messageGenerator('admin','new user joined'));

    socket.on('createMessage',(message)=>{
        console.log('new message',message);
        io.emit('newMessage',messageGenerator(message.from,message.text));
    });
    socket.on('disconnect',()=>{
        console.log('client disconnected');
    });
});
server.listen(port,(req,res)=>{
    console.log('server is running on port 3000');
});