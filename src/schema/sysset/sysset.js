const mongoose = require('mongoose')
const SyssetSchema = new mongoose.Schema({
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
    site_name: String,
    site_des: String,
    site_icon: String,
    send_mail:String,
    send_mail_key:String,
    comment:String
}, {
    versionKey: false,
    timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}
})
const MediaModel = mongoose.model('Sysset', SyssetSchema, 'Sysset')

module.exports = MediaModel