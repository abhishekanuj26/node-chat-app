const path=require('path');
const express=require('express');
const http=require('http');
const socketIo=require('socket.io');

const {Users}=require('./utils/users');
const {isrealstr}=require('./utils/valid');
const {messageGenerator,locationGenerator}=require('./utils/message');
const { callbackify } = require('util');
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);
var io=socketIo(server);
var users=new Users();
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('new user connected');
    /*
    socket.emit('newMessage',messageGenerator('admin','welcome to live-chat app'));
    socket.broadcast.emit('newMessage',messageGenerator('admin','new user joined'));
*/
    socket.on('join',(params,callback)=>{
        if(!isrealstr(params.name) || !isrealstr(params.room)){
            return callback('name and room name are required');
        }

        socket.join(params.room);
        users.removeuser(socket.id);
        users.adduser(socket.id,params.name,params.room);

        io.to(params.room).emit('update-user-list',users.getuserlist(params.room));
        socket.emit('newMessage',messageGenerator('admin','welcome to live-chat app'));
        socket.broadcast.to(params.room).emit('newMessage',messageGenerator('admin',`${params.name} has joined`));
        callback();
    });

    socket.on('createMessage',(message,callback)=>{
        console.log('new message',message);
        var user=users.getuser(socket.id);
       
        if(user && isrealstr(message.text)){
            io.to(user.room).emit('newMessage',messageGenerator(user.name,message.text));
        }
        
       callback();
    });


    socket.on('createLocation',(coords)=>{
        var user=users.getuser(socket.id);
        if(user){
        io.to(user.room).emit('newLocationMessage',locationGenerator(user.name,coords.latitude,coords.longitude));
        }
    })
    socket.on('disconnect',(params)=>{
        console.log('client disconnected');
        var user=users.removeuser(socket.id);

        if(user){
            io.to(user.room).emit('update-user-list',users.getuserlist(user.room));
            io.to(user.room).emit('newMessage',messageGenerator('admin',`${user.name} has left`));
        }
    });
});
server.listen(port,(req,res)=>{
    console.log('server is running on port 3000');
});