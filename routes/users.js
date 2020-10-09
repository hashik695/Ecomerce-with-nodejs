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
router.get("/",async function(req, res, next) {
  let user=req.session.user
   console.log(user);
   let cartCount=null
   if(req.session.user){
     cartCount=await userHelper.getCartItem(req.session.user._id)
   }
  productHelper.getAllProducts().then((products)=>{
    res.render('users/view-products',{products,user,cartCount});
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
   req.session.loggedIn=true
   req.session.user=response
   res.redirect('/')
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
router.get('/cart',verifyLogin,async(req,res)=>{
  let products=await userHelper.getCartProduct(req.session.user._id)
  console.log(products);
  res.render('users/cart',{products,user:req.session.user})
})
router.get('/add-to-cart/:id',(req,res)=>{
  console.log("api call");
  userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
})


module.exports = router;
