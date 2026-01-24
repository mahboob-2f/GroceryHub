import express from 'express';

const app = express();

app.get('/',(req,res)=>{
    res.send('Server is listening ...');
})

app.listen(3000,()=>{
    console.log("Server is listening at port 3000");
})