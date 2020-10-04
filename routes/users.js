var express = require("express");
var router = express.Router();
var productHelper=require('../helpers/products-helpers')
var userHelper=require('../helpers/user-helper')

/* GET home page. */
router.get("/", function (req, res, next) {
  let user=req.session.user
   console.log(user);
  productHelper.getAllProducts().then((products)=>{
    res.render('users/view-products',{products,user});
  })
 

});
router.get('/login',(req,res)=>{
  res.render('users/login')
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
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
module.exports = router;
