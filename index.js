const express = require('express')
const app = express();
const port = 3000;

app.get('/',(req, res)=>{
    res.send("dziala serwer")
})

app.listen(port, ()=> {
    console.log('serwer nie dziala na procie'+port)
})