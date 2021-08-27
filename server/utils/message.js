var messageGenerator = (from,text)=>{
    return{
    from,
    text,
    at : new Date().getTime()
}
};
module.exports={messageGenerator};