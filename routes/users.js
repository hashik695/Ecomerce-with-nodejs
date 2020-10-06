var express = require("express");
var router = express.Router();
var productHelper=require('../helpers/products-helpers')
var userHelper=require('../helpers/user-helper')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
} 
/* GET home page. */
router.get("/", function (req, res, next) {
  let user=req.session.user
   console.log(user);
  productHelper.getAllProducts().then((products)=>{
    res.render('users/view-products',{products,user});
  })
  

});
router.get('/login',(req,res)=>{
 
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('users/login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false


  }
})

router.get('/signup',(req,res)=>{
  res.render('users/signup')
})
router.post("/signup",(req,res)=>{
 userHelper.doSignup(req.body).then((response)=>{
   console.log(response);
 })

})
router.post("/login",(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr="Invalid Username or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',verifyLogin,(req,res)=>{
  res.render('users/cart')
})


module.exports = router;
