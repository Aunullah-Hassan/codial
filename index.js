const express=require('express');
const app=express();
const port=8000;

// use express router
app.use('/',require('./routes/index'));

// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(error){
    if(error){
        console.log(`Error : error in running express server ${error}`);
    }

    console.log(`Server is Up and Running on port : ${port}`);

});