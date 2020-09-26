var express = require("express");
var router = express.Router();
var productHelper=require('../helpers/products-helpers')

/* GET home page. */
router.get("/", function (req, res, next) {
 
  productHelper.getAllProducts().then((products)=>{
    console.log(products);
    res.render('users/view-products',{user:true,products});
  })

});

module.exports = router;
