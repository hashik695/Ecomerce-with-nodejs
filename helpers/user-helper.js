var db=require('../config/connection')
var collection=require('../config/collections')
var bcrypt=require("bcrypt")
const { resolve, reject } = require('promise')
const objectID  = require('mongodb').ObjectID
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.ops[0])

            })
            
        })
         
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
        
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
          
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                   if(status){
                       console.log("login Success");
                       response.user=user
                       response.status=true
                       resolve(response)
                    }else{
                    console.log("login failed");                 reject({status:false})
        
                   }
                })
            }else{
                console.log("login failed");
                reject({status:false})
            }
        }) 
    },
    addToCart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItem=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectID(userId)})
            if(cartItem){
              db.get().collection(collection.CART_COLLECTION).updateOne({user:objectID(userId)},{
                  $push:{products:objectID(proId)}
              }
              ).then((response)=>{
                  resolve()
              })
            }else{
                let cartObj={
                    user:objectID(userId),
                    products:[objectID(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProduct:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectID(userId)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let:{prodList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$prodList"]
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    },
    getCartItem:(userId)=>{
        return new Promise(async(resolve,reject)=>{
             let count=0
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectID(userId)})
            if(cart){
                count=cart.products.length

            }
            resolve(count)
        })
    }
    
}
