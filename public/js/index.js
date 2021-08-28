
var socket=io();
socket.on('connect',function(){
    console.log('connected to the server');
   
});
socket.on('disconnect',function(){
    console.log('disconnected');
});
socket.on('newMessage',function(message){
    console.log('new message',message);

    var li=jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
    
});

socket.on('newLocationMessage',function(message){
    var li=jQuery('<li></li>');
    var a=jQuery('<a target="_blank">my current location</a>');
    li.text(`${message.from}: `);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);

});

jQuery('#m-form').on('submit',function(e){
    e.preventDefault();

    socket.emit('createMessage',{
        from:"User",
        text:jQuery('[name=message]').val()
    },function(){

    });
});

//var location=jQuery('#s-location');

jQuery('#s-location').on('click',function(){
    
    if(!navigator.geolocation){
        return alert('geoloaction not supported by your device')
    }

    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocation',{
            longitude:position.coords.longitude,
            latitude:position.coords.latitude
        })
    },function(){
        alert('unable to fetch location')
    });
    
});
