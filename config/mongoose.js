const mongoose=require('mongoose');
const env = require('./environment');
mongoose.set("strictQuery",false);
mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`,{ useNewUrlParser: true,
useUnifiedTopology: true });

const db=mongoose.connection;

db.on('error',console.error.bind(console,'Error connecting to MongoDB'));

db.once('open',function(){
    console.log('Connected to Datatbase : : MongoDB');
});

module.exports=db;