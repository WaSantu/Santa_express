const SiteCommon = require('../common/common')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
class Artical extends SiteCommon {
    constructor() {
        super()
    }

    /**
     * @description 新建文章
     * @param {string} title 文章标题
     * @param {string} content_text 文章text内容
     * @param {string} content_html 文章markdown内容
     * @param {array} tag 文章标签
     * @param {string} is_stick 是否置顶
     * @param {array} artical_img 文章图片
     * @param {string} status 文章状态
     * @param {string} type 1 新建文章 2修改文章
     * @param {string} id  待修改文章的id
     */
    doArtical(title,content_text,content_html,tag,is_stick,artical_img,status,type,id){
        return new Promise((resolve, reject)=>{
            if(type == 1){
                this.articalmodel.create({
                    title:title,
                    content_text:content_text,
                    content_html:content_html,
                    tag:tag,
                    is_stick:is_stick,
                    artical_img:artical_img,
                    status:status
                },(e,d)=>{
                    if(e){
                        reject(this.toJson(e))
                        return
                    }
                    resolve(d)
                })
            }else{
                this.articalmodel.updateOne({_id:id},{
                    title:title,
                    content_text:content_text,
                    content_html:content_html,
                    tag:tag,
                    is_stick:is_stick,
                    artical_img:artical_img,
                    status:status
                },(e,d)=>{
                    if(e){
                        reject(this.toJson(e))
                        return
                    }
                    resolve(1)
                })
            }
        })
    }
    /**
     * @description 获取文章详情
     * @param {string} id 文章id
     */
    doGetArticalInfo(id){
        return new Promise((resolve, reject) => {
            this.articalmodel.aggregate([
                {
                    $match: {
                        _id:mongoose.Types.ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: "Comment",
                        let:{id:"$_id"},
                        pipeline:[{
                            $match:{
                                $expr:{
                                    $and:[{
                                        $eq:['$$id','$artical_id']
                                    },{
                                        $eq:['$status','1']
                                    }]
                                }
                            },
                        }],
                        as: "comment_arr"
                    }
                },
                {
                    $lookup: {
                        from:"Tag",
                        localField: "tag.tag_id",
                        foreignField:"_id",
                        as:"tag_arr"
                    }
                },
                {
                    $project:{
                        "tag":0,
                        "comment":0,
                        "artical_img":0
                    }
                }
            ],(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }
    /**
     * @description 修改文章状态
     * @param {array} ids 文章id数组
     * @param {string} status 修改的状态 1发布 2草稿 3删除
     */
    doChangeStatus(ids,status){
        return new Promise((resolve, reject) => {
            this.articalmodel.updateMany({_id: { $in:ids}},{
                status:status
            },(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(1)
            })
        })
    }

    /**
     * @description 获取文章列表
     * @param {string} status 文章状态
     * @param {string} page 页码
     * @param {string} keyword 关键词
     */
    doGetList(status,page,keyword=''){
        return new Promise((resolve, reject) => {
            let pagesize = 2
            let skip_page = (page - 1)*pagesize
            const reg = new RegExp(keyword)
            this.articalmodel.aggregate([{
                $match:{
                    status:String(status)
                }
            },{
                $lookup: {
                    from:"Tag",
                    localField: "tag.tag_id",
                    foreignField:"_id",
                    as:"tag_arr"
                }
            },{
                $sort:{
                    _id:-1
                }
            },{
                $match: {
                    $or:[{
                        title:{$regex:reg}
                    },{
                        'tag_arr.name':{$regex:reg}
                    }]
                }
            },{
                $skip:skip_page
            },{
                $limit:pagesize
            },{
                $project:{
                    tag:0,
                    artical_img:0,
                    tag_arr:{
                        createdAt:0,
                        updatedAt:0
                    }
                }
            }],(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }

    /**
     * @description 获取时间归档
     * @returns {Promise<unknown>}
     */
    doGetDate(){
        return new Promise((resolve, reject) => {
            this.articalmodel.aggregate([{
                $project:{
                    _id:0
                },
            },{
                $group:{
                    _id : {
                        month: { $month: "$createTime" },
                        year: { $year: "$createTime" },
                        },
                    count:{$sum:1}
                }
            }],(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }

    doGetListByDate(start,end){
        return new Promise((resolve, reject) => {
            this.articalmodel.aggregate([{
                $match:{
                        createTime:{$gte:new Date(start),$lt:new Date(end)}
                }
            },{
                $lookup: {
                    from:"Tag",
                    localField: "tag.tag_id",
                    foreignField:"_id",
                    as:"tag_arr"
                }
            },{
                $project:{
                    tag:0,
                    artical_img:0
                }
            }],(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }
}

module.exports = Artical