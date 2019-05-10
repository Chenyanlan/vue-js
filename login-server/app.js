var express = require('express')
var app = new express()
var router = require('./router/user')

bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.all('*', function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use('/users',router)
var url = "mongodb://localhost:27017/test"
var mongoose = require('mongoose')
mongoose.connect(url,{useNewUrlParser:true},(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('db connect success')
    }

})
//引入路由代替
//注意,这里换了路由,url地址发生了变化
//app.use('/users',router)

// var users=[
//     {name:'admin', pass:'123'},
//     {name:'user', pass:'321'}
// ]

// app.post('/validate',(req,res)=>{
//         // console.log(req.body)
//         // res.send(users)
//     var user = users.find((item)=>{
//         return item.name == req.body.name && item.pass== req.body.pass
//     })
//     res.json(user?user:{})
// })

var port = process.env.PORT || 3000

app.listen(port)
console.log('app is listening on port:'+port)

