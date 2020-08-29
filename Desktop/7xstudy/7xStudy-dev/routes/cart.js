var express = require("express");
var router = express.Router();

var studentModel = require("../models/students");

//requiring bcrypt js
var bcrypt = require("bcrypt");

//IMPORTING JWT
var jwt = require('jsonwebtoken');

//IMPORTING NODE LOCAL STORAGE
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


//Log In ########################################################################

//Middleware Function to check Authentication Cart

function checkLoginUserCart(req,res,next){

  var userToken = localStorage.getItem('userToken');

  //using try catch of jwt

  try {
      var decoded = jwt.verify(userToken, 'LoginToken');
    } catch(err) {
      res.redirect('/cart/login')
    }

  next();

}


// get login

router.get('/cart/login', (req,res)=> {
  res.render('login',{
    msg : 'You Need To Login First',
    loginUsername : ''
  })
})


//Login POst

router.post('/cart/login', (req,res) => {

  //Getting Data From login Page
  var get_email = req.body.student_email;
  var password = req.body.student_password;

  //checking username
  var checkUser = studentModel.findOne({email:get_email});

  checkUser.exec((err,docs) => {

      if (err) throw err;

      if(docs !== null){ 

      //Getting Password from Db
      var getUserID = docs._id;
      var getPassword = docs.password;
      var getUserName = docs.email;

      //checking if the db password & and login page password is same or not
      //also we have to decrypt the password 
      //if both are same then login succesfull

      if(bcrypt.compareSync( password, getPassword )){

      //Getting id from model in Token using jwt token
      var token = jwt.sign({ userID: getUserID }, 'LoginToken');
      //setting token to local storage
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUsername', getUserName);

      // console.log(localStorage.getItem('userToken'));
      // console.log(localStorage.getItem('loginUsername'));
      //redirect after login

      var loginUsername = localStorage.getItem('loginUsername');
      res.redirect('/cart')
      }

      else{
        console.log('wrong Password')
        res.render('login', {
          msg : "Wrong Password !"
        })
  
        }
      }

  })

})



router.get('/cart', checkLoginUserCart, (req,res)=> {

  var loginUsername = localStorage.getItem('loginUsername');

  console.log(req.query)

  var title = req.query.title;
  var course_id = req.query.course_id;
  var price = req.query.price;
  var quantity = req.query.quantity;

  var total = price * quantity
  

  studentModel.find({email: loginUsername}, (err, docs)=> {

    if(err){
      console.log('ERROR')
    }

    else{

      res.render('cart', {
        loginUsername: loginUsername,
        docs: docs,
        title: title,
        course_id: course_id,
        price: price,
        quantity: quantity,
        total : total
      })

      console.log(docs)

    }
  })
})







module.exports = router;

