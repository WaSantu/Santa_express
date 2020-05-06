const mongoose = require('mongoose')
const SiteCommon = require('../../controller/common/common')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    //账号
    account:{
        type:String,
        required:true
    },
    //密码
    password:{
        type:String,
        required: true
    },
    //昵称
    nickname:{
        type:String,
        required: true
    },
    //权限 superadmin,admin,normal,studyuser,超级用户权限有且只有一个
    auth:String,
    //创建时间
    created_time:String,
    //修改时间
    update_time:String
})


class User extends SiteCommon{
    constructor() {
        super()
        this.model = mongoose.model('User', UserSchema, 'User')
    }
    registerUser(type,account,password,nickname){
        return new Promise((resolve,reject)=>{
            if(type === 1){
                //超级管理创建
                let auth = 'superadmin'
                this.model.findOne({auth: 'superadmin'},(e,d)=>{
                    if(d){
                        reject(`超级管理已存在`)
                        return;
                    }
                    this._createUser(account,password,auth,nickname,(data)=>{
                        resolve(data)
                    },(e)=>{
                        reject(this.toJson(e))
                    })
                })
            }else{
                this.model.find({"$or":[{account:account},{nickname:nickname}]},(e,d)=>{
                    let test = jwt.sign({username: 1},'santa',{
                        expiresIn: 60 * 60 * 24 * 7  // 一周过期
                    })
                    console.log(test,'1')
                    if(d.length != 0){
                        reject(`账号或昵称重复`)
                        return
                    }
                    if(e){
                        reject(e)
                        return
                    }
                    if(type === 2){
                        //admin用户创建
                        let token = 'superadmin'
                        let auth = 'admin'
                        if(token != token){
                            reject(`用户权限出错`)
                            return;
                        }
                        this._createUser(account,password,auth,nickname,(data)=>{
                            resolve(data)
                        },(e)=>{
                            reject(this.toJson(e))
                        })
                    }else if(type === 3){
                        //普通用户创建

                        let auth = 'normal'
                        this._createUser(account,password,auth,nickname,(data)=>{
                            resolve(data)
                        },(e)=>{
                            reject(this.toJson(e))
                        })
                    }
                })
            }
        })
    }
    _createUser(account,password,auth,nickname,successCb,failCb){
        this.model.create({
            account,
            password,
            nickname,
            auth,
            created_time:+new Date(),
            update_time:+new Date()
        },(e,d)=>{
            if(e){
                failCb(e)
                return
            }
            successCb(d)
        })
    }
}

module.exports = User