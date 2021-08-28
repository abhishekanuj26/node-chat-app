var socket=io();
socket.on('connect',function(){
    console.log('connected to the server');
   
});
socket.on('disconnect',function(){
    console.log('disconnected');
});
socket.on('newMessage',function(message){
   
    
    jQuery('#send-m').removeAttr('disabled')
    var template = jQuery('#message-template').html();
    var html=Mustache.render(template,{
        text:message.text,
        from:message.from
    });

  jQuery('#messages').append(html);
    /* 
    console.log('new message',message);

    var li=jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
    */

    
});

socket.on('newLocationMessage',function(message){

    var temp=jQuery('#location_message-template').html();
    var html=Mustache.render(temp,{
        from:message.from,
        url:message.url
    });
    jQuery('#messages').append(html);

    /*
    var li=jQuery('<li></li>');
    var a=jQuery('<a target="_blank">my current location</a>');
    li.text(`${message.from}: `);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);
    */

});

jQuery('#m-form').on('submit',function(e){
    e.preventDefault();

    socket.emit('createMessage',{
        from:"User",
        text:jQuery('[name=message]').val()
    },function(){
        jQuery('[name=message]').val(" ");
    });
});

//var location=jQuery('#s-location');

jQuery('#s-location').on('click',function(){
    
    if(!navigator.geolocation){
        return alert('geoloaction not supported by your device')
    }
    jQuery('#s-location').attr('disabled','disabled').text('sharing location...');
    navigator.geolocation.getCurrentPosition(function(position){
        jQuery('#s-location').removeAttr('disabled').text('share location');
        socket.emit('createLocation',{

            longitude:position.coords.longitude,
            latitude:position.coords.latitude
        })
    },function(){
        jQuery('#s-location').removeAttr('disabled').text('share location');
        alert('unable to fetch location')
    });
    
});
