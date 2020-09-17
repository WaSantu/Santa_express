const mongoose = require('mongoose')
const LinkSchema = new mongoose.Schema({
    link_name:String,
    link_site:String,
    link_des:String,
    link_mail:String,
    status:{
        type:String,
        default:'0'
    }
},{
    versionKey:false,
    timestamps:{ createdAt: 'createdAt', updatedAt: 'updatedAt' }
})
const LinkModel = mongoose.model('Link', LinkSchema, 'Link')

module.exports = LinkModel