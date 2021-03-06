const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    //账号
    account: {
        type: String,
        required: true
    },
    //密码
    password: {
        type: String,
        required: true
    },
    //私钥
    secret: {
        type: String,
        required: true
    },
    //昵称
    nickname: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}
})
const userModel = mongoose.model('User', UserSchema, 'User')

module.exports = userModel