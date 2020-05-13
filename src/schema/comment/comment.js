const mongoose = require('mongoose')
const CommentSchema = new mongoose.Schema({
    //关联文章id
    artical_id:{
        type:String,
        required:true
    },
    //评论人id
    creator_id:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    },
    //回复评论人id
    to_userid:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    //评论内容
    content:{
        type:String,
        required:true
    },
    //点赞数量
    like:{
        type:Number,
        default:0
    },
    create_time:String,
    update_time:String
})
const CommentModel = mongoose.model('Comment', CommentSchema, 'Comment')

module.exports = CommentModel