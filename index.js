const express=require('express');
const env = require('./config/environment');
const logger = require('morgan');

const cookieParser=require('cookie-parser');

const app=express();

require('./config/view-helpers')(app);

const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose')

// require library for session cookie and authorization localStrategy
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');

const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2_strategy');

const flash=require('connect-flash');
const customMiddleware=require('./config/middleware');

// const MongoStore = require('connect-mongodb-session')(session);

const sassMiddleware=require('node-sass-middleware');

// set up the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

const path = require('path');

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'css'),
        debug:true,
        outputStyle: 'extended',
        prefix:'/css'
    }));

}


app.use(express.urlencoded({extended:false}));

app.use(cookieParser());

// use static files
app.use(express.static(env.asset_path));


// make the upload path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

// Extracts styles and scripts from sub-pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

// mongo store is used to store the session cookie in db
app.use(session({
    name: 'codial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: MongoStore.create({
            // mongooseConnection:db,
            mongoUrl:'mongodb://127.0.0.1:27017/codial_development',
            autoRemove: "disabled"
        },
        function(err){
            console.log(err || 'Connect-mongodb-store setup ok');
        }
        )
}));

// app.use(session({
//     name: 'codeial',
//     secret:'blahsomething',
//     saveUninitialized:false,
//     resave:false,
//     cookie: {
//         maxAge: (1000*60*100)
//     },
//     store: new MongoStore({
//         // mongooseConnection:db 
//         mongoUrl: db._connectionString, 
//         autoRemove: 'disabled'
//     }, function(err){
//         console.log(err || 'connect-mongo setup ok')
//     })
// }));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);
// use express router
app.use('/',require('./routes/index'));


app.listen(port,function(error){
    if(error){
        console.log(`Error : error in running express server ${error}`);
    }

    console.log(`Server is Up and Running on port : ${port}`);

});