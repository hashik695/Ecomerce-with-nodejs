const { resolve, reject } = require('promise');
var db=require('../config/connection')
var bcrypt=require("bcrypt")
var collection=require('../config/collections')
var objectId=require("mongodb").ObjectID
module.exports={
    Login:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
        
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:adminData.email})
          
            if(admin){
                bcrypt.compare(adminData.password,admin.password).then((status)=>{
                   if(status){
                       console.log("login Success");
                       response.admin=admin
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
    addProduct:(product,callback)=>{
        console.log(product);
        product.Price=parseInt(product.Price)
        db.get().collection('product').insertOne(product,product.Price).then((data)=>{
            console.log(product.Price)
          
           callback(data.ops[0]._id)
        })

    },
    
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            console.log(proId)
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(proId)} ).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
         db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
             resolve(product)

         })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Category:proDetails.Category,
                    Price:proDetails.Price,
                    Description:proDetails.Description
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    getAllUser:()=>{
        return new Promise((resolve,reject)=>{
            let users=db.get().collection(collection.USER_COLLECTION).find().toArray()

           resolve(users)
        })
  },
  getAllUserOrder:()=>{
        return new Promise((resolve,reject)=>{
            let orders=db.get().collection(collection.ORDER_COLLECTION).find().toArray()

            resolve(orders)
        })
  }
}