const SiteCommon = require('../common/common')
const jwt = require('jsonwebtoken')


class User extends SiteCommon{
    constructor() {
        super()
    }
    registerUser(type,account,password,nickname){
        return new Promise((resolve,reject)=>{
            if(type === 1){
                //超级管理创建
                let auth = 'superadmin'
                this.usermodel.findOne({auth: 'superadmin'},(e,d)=>{
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
                this.usermodel.find({"$or":[{account:account},{nickname:nickname}]},(e,d)=>{
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
    deleteUser(token,id){
        return new Promise((resolve, reject) => {
            this.verifySuperAdmin(token).then(r=>{
                if(d._id != id){
                    this.usermodel.update({_id:id},{status:0},(e,d)=>{
                        if(e){
                            reject(this.toJson(e))
                            return
                        }else{
                            resolve(1)
                        }
                    })
                }else{
                    reject('不能删除自己')
                }
            }).catch((e)=>{
                reject(e)
            })
        })
    }
    _createUser(account,password,auth,nickname,successCb,failCb){
        this.usermodel.create({
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