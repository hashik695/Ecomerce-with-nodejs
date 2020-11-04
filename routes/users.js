var express = require("express");
var router = express.Router();
var productHelper=require('../helpers/products-helpers')
var userHelper=require('../helpers/user-helper')
const verifyLogin=(req,res,next)=>{
  if(req.session.userLoggedIn){
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
 
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('users/login',{"loginErr":req.session.userLoginErr})
    req.session.userLoginErr=false


  }
})

router.get('/signup',(req,res)=>{
  res.render('users/signup')
})
router.post("/signup",(req,res)=>{
 userHelper.doSignup(req.body).then((response)=>{
   console.log(response);
   req.session.user=response
   req.session.user.loggedIn=true
   res.redirect('/')
 })

})
router.post("/login",(req,res)=>{
  console.log(req.body);
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
     
      req.session.user=response.user
      req.session.userLoggedIn=true   
      res.redirect('/')
    }else{
      req.session.userLoginErr="Invalid Username or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.user=null
  req.session.userLoggedIn=false
  res.redirect('/')
})
router.get('/cart',verifyLogin,async(req,res)=>{
  let products=await userHelper.getCartProduct(req.session.user._id)
  let totalValue=0
  if(products.length>0)
  {
   totalValue=await userHelper.getTotalAmout(req.session.user._id)
  }
  
  console.log(products);
  res.render('users/cart',{products,user:req.session.user,totalValue})
})
router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  console.log("api call");
  userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
})

router.post('/cart-product-quantity',(req,res,next)=>{
  console.log(req.body);
  userHelper.changeProductQuantity(req.body).then(async(response)=>{
  response.total=await userHelper.getTotalAmout(req.body.user)

  res.json(response)

  })
})
router.post('/cart-product-remove',(req,res,next)=>{
  console.log(req.body);
  userHelper.cartRemoveProduct(req.body).then((respones)=>{
    res.json(respones)
  })
})
router.get('/place-order',verifyLogin,async(req,res)=>{
  let total=await userHelper.getTotalAmout(req.session.user._id)
  res.render('users/place-order',{total,user:req.session.user})
})
router.post('/place-order',async(req,res)=>{
  let products=await userHelper.getCartProductList(req.body.userId)
  let  totalPrice=await userHelper.getTotalAmout(req.body.userId)
  userHelper.placeOrder(req.body,products,totalPrice).then((orderId)=>{
    if(req.body['payment-method']==='COD'){
      res.json({codSuccess:true})
    }else{
      userHelper.generateRazorpay(orderId,totalPrice).then((response)=>{
        res.json(response)

      })

    }
     
     
  })

 
  console.log(req.body);
 
})
router.get('/order-success',(req,res)=>{
  res.render('users/order-success',{user:req.session.user})
})


router.get('/order',async(req,res)=>{
  let orders=await userHelper.getUserOrder(req.session.user._id)
  res.render('users/order',{user:req.session.user,orders})
})
router.get('/view-order-products/:id',async(req,res)=>{
  let products=await userHelper.getOrderProduct(req.params.id)
  res.render('users/view-order-products',{user:req.session.user,products})
})

router.post('/verify-payment',(req,res)=>{
  console.log(req.body);
  userHelper.verifyPayment(req.body).then(()=>{
    userHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log("payment ");
      res.json({status:true})
    })
  }).catch((err)=>{
    console.log(err);
    res.json({status:false})
  })
  
  })
  router.get('/orders',verifyLogin,async(req,res)=>{
    let orders=await userHelper.getUserOrder(req.session.user._id)
    res.render('users/order',{orders,user:req.session.user})
  })

  router.get('/profile',verifyLogin,async(req,res)=>{
    let user=req.session.user
    console.log(user);
    let orders=await userHelper.getUserOrder(req.session.user._id)
    console.log(orders);
    res.render('users/profile',{orders,user:req.session.user})
  })
  
module.exports = router;
