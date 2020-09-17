const jwt = require('jsonwebtoken')
const userModel = require('../../schema/user/user')
const mediaModel = require('../../schema/media/media')
const articalModel = require('../../schema/artical/artical')
const commentModel = require('../../schema/comment/comment')
const tagModel = require('../../schema/tag/tag')
const sysmodel = require('../../schema/sysset/sysset')
const linkmodel = require('../../schema/link/link')
const config = require('../../../config.json')

const docrypto = require('../../crypto/crypto')
const fs = require('fs')
const nodemailer = require('nodemailer')

class SiteCommon {
    constructor() {
        this.usermodel = userModel
        this.mediamodel = mediaModel
        this.articalmodel = articalModel
        this.commentmodel = commentModel
        this.tagmodel = tagModel
        this.sysmodel = sysmodel
        this.linkmodel = linkmodel
        this.config = config
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
    checkParmasName(params){
        return function(req,res,next){
            for(let val of params){
                if(!req.body[val.val]){
                    res.json({code:201,msg:`${val.text}不能为空`})
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
                    if(val.type == 'array'){
                        if(req.body[val.val] instanceof Array){
                            next()
                            return
                        }else{
                            res.json({code:201,msg:`${val.val}参数有误`})
                            return
                        }
                    }else{
                        res.json({code:201,msg:`${val.val}参数有误`})
                        return
                    }
                }
            }
            next()
        }
    }
    verifySuperAdmin(token){
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'santa',(e,d)=>{
                if(e){
                    reject('登录时效过期或未授权请求')
                    return
                }
                if(d.data.auth != 100){
                    reject('登录时效过期或未授权请求')
                    return
                }
                resolve(d.data)
                // this.usermodel.find({_id:d._id},(e,d)=>{
                //     if(e || d.length === 0 || !d){
                //         reject('权限验证出错')
                //         return
                //     }
                //     if(d.auth != 100){
                //         reject('权限验证出错')
                //         return
                //     }else{
                //         resolve(d)
                //     }
                // })
            })
        })
    }
    doLogError(e){
        //写入数据库失败操作记录
    }
    doDecodeInfo(data,password){
        return docrypto.crypto_decode(data,password)
    }
    doCodeInfo(data,password){
        return docrypto.crypto_code(data,password)
    }
    doCreateSecretKey(data){
        let time = +new Date() + data
        return docrypto.crypto_code(data)
    }
    getsysset(){
        return new Promise((resolve, reject) => {
            this.sysmodel.findOne({},(e,d)=>{
                resolve(d)
            })
        })
    }
    async mail(msg,target){
        let re = await this.getsysset()
        let master_mail = re.send_mail
        let master_key = re.send_mail_key
        let site_name = re.site_name
        let transporter = nodemailer.createTransport({
            host: 'smtp.qq.com',
            secureConnection: true, // use SSL
            port: 465,
            secure: true, // secure:true for port 465, secure:false for port 587
            auth: {
                user: master_mail,
                pass: master_key// QQ邮箱需要使用授权码
            }
        });
        let send_target
        if(target){
            send_target = target
        }else{
            send_target = re.send_mail
        }
        let send_msg = `${msg}`
        let mailOptions = {
            from: `"${site_name}" <${master_mail}>` , // 发件人
            to: send_target, // 收件人
            subject: `${site_name}`, // 主题
            text: send_msg, // plain text body
            // 下面是发送附件，不需要就注释掉
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }
}

module.exports = SiteCommon