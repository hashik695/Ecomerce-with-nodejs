var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products = [
    {
      name: "IPHONE 11",
      category: "mobile",
      description: "this is new phone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ6vH8yrDkeH-87FWpoObUsBeGowp4GDFT9EA&usqp=CAU",
    },
    {
      name: "Redmi 11",
      category: "mobile",
      description: "this is new phone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRhc533cFrjEl1Gx2PSiXzGDQiohQ17drHPMQ&usqp=CAU",
    },
    {
      name: "Samsung",
      category: "mobile",
      description: "this is new phone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS9nCmaumRLx4cAygMVP8G1XgkpneKfpnyPGQ&usqp=CAU",
    },
    {
      name: "Windows",
      category: "mobile",
      description: "this is new phone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRtX2AvAcz1HTc2dE0tT_MryHTl5cwCyccgLQ&usqp=CAU",
    },
  ];

  res.render('admin/view-products',{admin:true,products});
});
  router.get('/add-products',(req,res)=>{
    res.render('admin/add-products')
  });
  router.post('/add-products',(req,res)=>{
    console.log(req.body);
    console.log(req.files.Image);
  })



module.exports = router;
