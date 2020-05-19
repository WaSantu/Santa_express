const SiteCommon = require('../common/common')
const jwt = require('jsonwebtoken')


class User extends SiteCommon{
    constructor() {
        super()
        this.doLogError()
    }
    registerUser(type,account,password,nickname){
        return new Promise((resolve,reject)=>{
            if(type === 1){
                //超级管理创建
                this.usermodel.findOne({auth: 100},(e,d)=>{
                    if(d){
                        reject(`超级管理已存在`)
                        return;
                    }
                    let secret_key = this.doCreateSecretKey(nickname)
                    let secret_password = this.doCodeInfo(password,secret_key)
                    this._createUser(account,secret_password,secret_key,100,nickname,(data)=>{
                        let token =  jwt.sign({name: "user", data: data}, 'santa', {expiresIn: 60*60*24*3600})
                        let send_data = this.doCodeInfo(token)
                        resolve(send_data)
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
                        let secret_key = this.doCreateSecretKey(nickname)
                        let secret_password = this.doCodeInfo(password,secret_key)
                        this._createUser(account,secret_password,secret_key,101,nickname,(data)=>{
                            resolve(this,this.doCodeInfo(token))
                        },(e)=>{
                            reject(this.toJson(e))
                        })
                    }else if(type === 3){
                        //普通用户创建
                        let secret_key = this.doCreateSecretKey(nickname)
                        let secret_password = this.doCodeInfo(password,secret_key)
                        this._createUser(account,secret_password,secret_key,102,nickname,(data)=>{
                            resolve(this,this.doCodeInfo(token))
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
                    this.usermodel.update({_id:id},{status:0,update_time: +new Date()},(e,d)=>{
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
    getUserList(){
        return new Promise((resolve, reject) => {
            this.usermodel.find({status:1},(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }
    getUserInfo(id){
        return new Promise((resolve, reject) => {
            this.usermodel.find({_id:id,status:1},(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }
    doUserLogin(account,password){
        return new Promise((resolve, reject) => {
            this.usermodel.findOne({account:account,status:1},(e,d)=>{
                if(d.auth != 100 & d.auth != 101){
                    reject('用户权限不足')
                    return
                }
                if(d.length === 0){
                    reject('用户名错误')
                    return
                }
                if(e){
                    reject(this.toJson(e))
                    return
                }
                let pwd = this.doCodeInfo(password,d.secret)
                if(d.password != pwd){
                    reject(`用户密码错误`)
                    return
                }
                let token =  this.doCodeInfo(jwt.sign({name: "user", data: d}, 'santa', {expiresIn: 60*60*24*3600}))
                resolve(token)
            })
        })
    }
    doUserAutoLogin(token,to){
        return new Promise((resolve, reject) => {
            jwt.verify(token,'santa',(e,d)=>{
                if(e){
                    reject('权限验证出错')
                    return
                }
                let {account,password} = d.info
                this.usermodel.find({account:account,password:password,status:1},(e,d)=>{
                    if(to === 'admin'){
                        if(d.auth != 'admin' || d.auth != 'superadmin'){
                            reject('用户权限出错')
                            return
                        }
                    }
                    if(e || d.length === 0){
                        reject('登陆时效过期，请重新登陆')
                        return
                    }
                    resolve(1)
                })
            })
        })
    }
    _createUser(account,password,secret,auth,nickname,successCb,failCb){
        this.usermodel.create({
            account,
            password,
            nickname,
            auth,
            secret,
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