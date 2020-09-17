const SiteCommon = require('../common/common')
const jwt = require('jsonwebtoken')
class Sysset extends SiteCommon {
    constructor() {
        super()
    }

    /**
     * @description 初始化系统设置
     * @param account {string} 管理用用户名
     * @param password {string} 管理员密码
     * @param nickname {string} 昵称
     * @param site_name {string} 站点名称
     * @param site_des {string} 站点介绍
     * @param site_icon {string} 站点icon
     * @param send_mail {string} 站点stmp邮限
     * @param send_mail_key {string} stmp邮箱码
     * @param comment {string} 评论是否审核
     */
    initSiteSysset(account,password,nickname,site_name,site_des,site_icon,send_mail,send_mail_key,comment){
        return new Promise((resolve,reject)=>{
            let secret_key = this.doCreateSecretKey(password)
            let secret_password = this.doCodeInfo(password, secret_key)
            this.sysmodel.create({
                account:account,
                password:secret_password,
                secret:secret_key,
                site_name:site_name,
                site_des:site_des,
                site_icon:site_icon,
                send_mail:send_mail,
                send_mail_key:send_mail_key,
                comment:comment
            },(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                let token = jwt.sign({name: "user", data: d}, this.config.token_key, {expiresIn: 60 * 60 * 24 * 3600})
                resolve(token)
            })
        })
    }
    /**
     * @description 修改系统设置
     * @param account {string} 管理用用户名
     * @param nickname {string} 昵称
     * @param site_name {string} 站点名称
     * @param site_des {string} 站点介绍
     * @param site_icon {string} 站点icon
     * @param send_mail {string} 站点stmp邮限
     * @param send_mail_key {string} stmp邮箱码
     * @param comment {string} 评论是否审核
     */
    editSiteSysset(account,nickname,site_name,site_des,site_icon,send_mail,send_mail_key,comment){
        return new Promise((resolve,reject)=>{
            this.sysmodel.updateOne({},{
                account:account,
                nickname:nickname,
                site_name:site_name,
                site_des:site_des,
                site_icon:site_icon,
                send_mail:send_mail,
                send_mail_key:send_mail_key,
                comment:comment
            },(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }

    /**
     * @description 登录
     * @param {string} account 账号
     * @param {string} password 密码
     * @param {string} type 登录方式
     */
    doLogin(account,password,type='normal'){
        return new Promise((resolve,reject)=>{
            this.sysmodel.findOne({account:account},(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                if(!d){
                    reject('账号输入错误')
                    return
                }
                let d_password = this.doDecodeInfo(d.password,d.secret)
                if(d_password === password){
                    if(type == 'auto'){
                        resolve(1)
                    }else{
                        delete d.password
                        d['password'] = password
                        let token = jwt.sign({name: "user", data: d}, this.config.token_key, {expiresIn: 60 * 60 * 24 * 3600})
                        resolve(token)
                    }
                }else{
                    reject('密码错误')
                    return
                }
            })
        })
    }
}

module.exports = Sysset