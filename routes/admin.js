var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/products-helpers')
var userHelper=require('../helpers/user-helper')
const verifyLogin=(req,res,next)=>{
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('admin/login')
  }
}
/* GET users listing. */
router.get('/admin',(req,res)=>{
 
  if(req.session.admin){
    res.redirect('admin/view-products')
  }else{
    res.render('admin/login',{"loginErr":req.session.adminLoginErr,admin:true})
    req.session.adminLoginErr=false


  }
})
router.get('/admin/view-products',verifyLogin,(req, res, next)=> {
  console.log(req.body);
  productHelper.getAllProducts().then((products)=>{
    console.log('products');
    res.render('admin/view-products',{admin:true,products});
  })
  
});


router.post("/admin",(req,res)=>{
  console.log(req.body);
  productHelper.Login(req.body).then((response)=>{
    if(response.status){
      
     
      req.session.admin=response.admin
      req.session.adminLoggedIn=true   
      res.redirect('admin/view-products')
    }else{
      req.session.adminLoginErr="Invalid Username or password"
      res.redirect('admin/login')
    }
  })
})




  router.get('/add-products',verifyLogin,(req,res)=>{
    res.render('admin/add-products',{admin:true})
  });
  router.post('/add-products',(req,res)=>{
    console.log(req.body);
    console.log(req.files.Image);

    productHelper.addProduct(req.body,(id)=>{
      let image=req.files.Image
      
      console.log(id);
      image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
        if(err){
          res.render("admin/add-products")
        }else
        console.log(err);
       
      })
      
    })
  })
  router.get("/delete-product/:id",verifyLogin,(req,res)=>{
    let proId=req.params.id
    console.log(proId);
    productHelper.deleteProduct(proId).then((response)=>{
      res.redirect('/admin')
    })

  })
router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelper.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})

router.post("/edit-product/:id",(req,res)=>{
  console.log(req.params.id);
  productHelper.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/'+req.params.id+'.jpg')
    }
  })
})
router.get('/allOrders',verifyLogin,(req,res)=>{
   productHelper.getAllUserOrder().then((orders)=>{
    res.render('admin/all-order',{orders,admin:true})
   })  
  
})
router.get('/allUsers',verifyLogin,(req,res)=>{
  productHelper.getAllUser().then((users)=>{
  console.log(users);
  res.render('admin/all-users',{users,admin:true})
  })
})
module.exports = router;
