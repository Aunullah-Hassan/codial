const express=require('express');
const app=express();
const port=8000;

app.use('/',require('./routes/index'));

app.listen(port,function(error){
    if(error){
        console.log(`Error : error in running express server ${error}`);
    }

    console.log(`Server is Up and Running on port : ${port}`);

});