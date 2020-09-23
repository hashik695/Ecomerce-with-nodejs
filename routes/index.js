var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
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

  res.render("index", { products, admin: false });
});

module.exports = router;
