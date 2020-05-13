const mongoose = require('mongoose')
const TagSchema = new mongoose.Schema({
    //tag名称
    name:{
        type:String,
        required:true
    },
    //创建者id
    creator_id:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    //是否热门,0不热门，数字越大越热门
    is_hot:{
        type:Number,
        default:0
    },
    create_time:String,
    update_time:String
})
const TagModel = mongoose.model('Tag', TagSchema, 'Tag')

module.exports = TagModel