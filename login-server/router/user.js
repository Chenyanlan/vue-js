var express = require('express')
var router = express.Router()

var User = require('../models/user')

var users = [
    {name:'admin',pass:'123'},
    {name:'user',pass:'321'}
]

router.route('/validate').post((req,res)=>{
    console.log(req.body)
     User.findOne({name:req.body.name,pass:req.body.pass},(err,user)=>{
         if(err){
           console.log(err)
        }
        res.json(user)
     })
    // var user = users.find((item)=>{
    //     return item.name==req.body.name &&item.pass== req.body.pass
    // })
    // res.json(user ? user :{})
})


module.exports = router