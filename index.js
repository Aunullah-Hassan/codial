const express=require('express');
const cookieParser=require('cookie-parser');

const app=express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose')

// app.use(express.urlencoded);

app.use(cookieParser());

// use static files
app.use(express.static('./assets'));

app.use(expressLayouts);

// Extracts styles and scripts from sub-pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

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