const express=require('express');
const cookieParser=require('cookie-parser');

const app=express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose')

// require library for session cookie and authorization localStrategy
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

app.use(express.urlencoded({extended:false}));

app.use(cookieParser());

// use static files
app.use(express.static('./assets'));

app.use(expressLayouts);

// Extracts styles and scripts from sub-pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name: 'codial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie: {
        maxAge: (1000*60*100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// use express router
app.use('/',require('./routes/index'));


app.listen(port,function(error){
    if(error){
        console.log(`Error : error in running express server ${error}`);
    }

    console.log(`Server is Up and Running on port : ${port}`);

});