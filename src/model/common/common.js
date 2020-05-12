const jwt = require('jsonwebtoken')
const userModel = require('../../schema/user/user')
const mediaModel = require('../../schema/media/media')
const articalModel = require('../../schema/artical/artical')
const commentModel = require('../../schema/comment/comment')
const fs = require('fs')

class SiteCommon {
    constructor() {
        this.usermodel = userModel
        this.mediamodel = mediaModel
        this.articalmodel = articalModel
        this.commentmodel = commentModel
    }
    toJson(content){
        return JSON.parse(JSON.stringify(content))
    }
    checkParmas(params){
        return function(req,res,next){
            for(let val of params){
                if(!req.body[val]){
                    res.json({code:201,msg:`缺少参数${val}`})
                    return
                }
            }
            next()
        }
    }
    checkParmasType(params){
        return function(req,res,next){
            for(let val of params){
                if(!req.body[val.val] || typeof req.body[val.val] != val.type){
                    res.json({code:201,msg:`${val.val}参数有误`})
                    return
                }
            }
            next()
        }
    }
    verifySuperAdmin(token){
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'santa',(e,d)=>{
                if(e && !d._id){
                    return false
                }
                this.usermodel.find({_id:d._id},(e,d)=>{
                    if(e || d.length === 0 || !d){
                        reject('权限验证出错')
                        return
                    }
                    if(d.auth != 'superadmin'){
                        reject('权限验证出错')
                        return
                    }else{
                        resolve(d)
                    }
                })
            })
        })
    }
    doLogError(e){
        //写入数据库失败操作记录

    }
}

module.exports = SiteCommon