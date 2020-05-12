const mongoose = require('mongoose')
const ArticalSchema = new mongoose.Schema({
    //文章标题
    title:{
      required:true,
      type:String
    },
    //文章作者
    creator_id:{
      required: true,
      type:mongoose.Schema.ObjectId,
      ref:'User'
    },
    //文章string内容
    content_text:{
        type:String,
        required:true
    },
    //文章markdown内容
    content_html:{
        type:String,
        required:true
    },
    //文章标签
    tag:[{
        tag_id:{
            type:mongoose.Schema.ObjectId,
            ref:'Tag'
        }
    }],
    //文章查看数
    look_num:{
        type:Number,
        default: 0
    },
    //文章是否置顶 0不置顶，需手动设定置顶层级，越大越在上面
    is_stick:{
        type:Number,
        default:0
    },
    //文章首页配图
    artical_img:{
        type:mongoose.Schema.ObjectId,
        ref:'Media'
    },
    //文章状态 1已发布，2草稿箱，3未发布，4删除
    status:{
        type: String,
        default:1
    },
    create_time:String,
    update_time:String
})
const ArticalModel = mongoose.model('Media', ArticalSchema, 'Media')

module.exports = ArticalModel