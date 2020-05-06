var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
var MergeApi = require('./src/controller/index')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var jwt =require('express-jwt') 
let options = {
    setHeaders: function (res, path, stat) {
      res.set('Access-Control-Allow-Origin', '*')
    }
  }
app.use(express.json());
app.use('/public',express.static(path.join(__dirname, 'public'),options));
// app.use(jwt({
//     secret:'santa'
// }).unless({
//     path: ['/api/user/login','/api/user/sign']  //除了这个地址，其他的URL都需要验证
// }));
//
//
//
// app.use(function (err, req, res, next) {
//     if (err) {
//         //如果token验证不通过，前台返回401
//         res.json({ code: 401 })
//     }else{
//         next()
//     }
// });
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(bodyParser.json());
app.all("*",function (req, res, next) {
    next();
});
app.listen(8889, () => {
    mongoose.connect('mongodb://localhost/mydb', (r) => {
        if (!r) {
            console.log('数据库启动成功')
        } else {
            console.log(`数据库启动失败 ${r}`)
        }
    })
})
MergeApi(app)

module.exports = app;




