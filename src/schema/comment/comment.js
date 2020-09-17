const mongoose = require('mongoose')
const CommentSchema = new mongoose.Schema({
    //关联文章id
    artical_id:{
        type:mongoose.Schema.ObjectId
    },
    form_user:String,
    from_website:String,
    from_email:String,
    to_user:String,
    to_user_mail:String,
    //评论内容
    content:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:1
    }
},{
    versionKey: false,
    timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}
})
const CommentModel = mongoose.model('Comment', CommentSchema, 'Comment')

module.exports = CommentModel