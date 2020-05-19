const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    //账号
    account:{
        type:String,
        required:true
    },
    //密码
    password:{
        type:String,
        required: true
    },
    //私钥
    secret:{
        type:String,
        required:true
    },
    //昵称
    nickname:{
        type:String,
        required: true
    },
    status:{
        type:Number,
        default:1
    },
    //权限 超级用户权限有且只有一个 100 超管，101管理远 102普通用户
    auth:Number,
    //创建时间
    created_time:String,
    //修改时间
    update_time:String
})
const userModel = mongoose.model('User', UserSchema, 'User')

module.exports = userModel