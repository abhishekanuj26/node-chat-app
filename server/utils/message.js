var messageGenerator = (from,text)=>{
    return{
    from,
    text,
    at : new Date().getTime()
}
};

var locationGenerator= (from,lat,lon)=>{
    return{
        from,
        url:`https://www.google.com/maps?q=${lat},${lon}`,
        at : new Date().getTime()
    }
};
module.exports={messageGenerator,locationGenerator};