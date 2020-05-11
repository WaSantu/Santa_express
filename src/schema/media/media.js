const mongoose = require('mongoose')
const MediaSchema = new mongoose.Schema({
    //种类
    name:String,
    link:String,
    creator_id:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    status:{
        type: String,
        default:1
    },
    create_time:String,
    update_time:String
})
const MediaModel = mongoose.model('Media', MediaSchema, 'Media')

module.exports = MediaModel