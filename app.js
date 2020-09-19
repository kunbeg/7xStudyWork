const express = require('express')
const app = express()
const port = 3000


var dbcreds = require("./secrets/dbcreds.json")

var dbusername = dbcreds["dbusername"]
var dbpassword = dbcreds["dbpassword"]

console.log("user name is " + dbusername);
console.log("password is " + dbpassword);

var mongoose = require('mongoose')
mongoose.connect(
'mongodb+srv://'+dbusername+':'+dbpassword+'@7xstudy-mongodb.ewlpj.mongodb.net/7xstudy?retryWrites=true&w=majority',
{useNewUrlParser: true , useCreateIndex:true, useUnifiedTopology: true}, 
    ()=>{console.log('MongoDb Connected ***')}
);

//IMPORTING BODY-PARSER
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//IMPORTING ROUTES
var indexRoute = require('./routes/index'); 
var dashboardRoute = require('./routes/dashboard'); 
var cartRoute = require('./routes/cart')
var paymentRouter = require('./routes/payment')


//SETTING UP PUBLIC DIRECTORY
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));


//SETTING VIEW ENGINE
app.set('view engine', 'ejs')


//SETTING ROUTES
app.use('/', indexRoute);
app.use('/', dashboardRoute);
app.use('/', cartRoute);
app.use('/', paymentRouter)

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.send('404 Page Not Found');
});

//SETTING UP PORT
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))