const mongoose = require('mongoose')
const TagSchema = new mongoose.Schema({
    //tag名称
    name:{
        type:String,
        required:true
    }
},{
    versionKey:false,
    timestamps:{ createdAt: 'createdAt', updatedAt: 'updatedAt' }
})
const TagModel = mongoose.model('Tag', TagSchema, 'Tag')

module.exports = TagModel