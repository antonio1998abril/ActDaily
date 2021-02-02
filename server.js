const express=require('express');
const app=express();
const bodyParser = require("body-parser");
const path=require('path')
const hbs=require('express-handlebars');
const hbshelpers=require('handlebars-helpers');
const multihelpers=hbshelpers();
const methodOverride=require('method-override');
const cors= require('cors')
const session = require('express-session');
require('dotenv').config()


const defaultroute=require('./routes/defaultRoute');



const http =require('http').Server(app)
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}));
app.use(cors());


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('newMethod'))

app.engine('handlebars',hbs({defaultLayout:'default',helpers:{multihelpers}}))
app.set('view engine','handlebars');


app.use('/',defaultroute)


const port =process.env.PORT||3000
http.listen(port,()=>{
    console.log("corriendo")
})