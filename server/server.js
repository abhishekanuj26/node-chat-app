const path=require('path');
const express=require('express');
const http=require('http');
const socketIo=require('socket.io');

const {messageGenerator,locationGenerator}=require('./utils/message');
const { callbackify } = require('util');
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

    socket.on('createMessage',(message,callback)=>{
        console.log('new message',message);
        io.emit('newMessage',messageGenerator(message.from,message.text));
       callback();
    });


    socket.on('createLocation',(coords)=>{
        io.emit('newLocationMessage',locationGenerator('admin',coords.latitude,coords.longitude));
    })
    socket.on('disconnect',()=>{
        console.log('client disconnected');
    });
});
server.listen(port,(req,res)=>{
    console.log('server is running on port 3000');
});