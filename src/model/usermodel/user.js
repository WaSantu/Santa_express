const SiteCommon = require('../common/common')
const jwt = require('jsonwebtoken')


class User extends SiteCommon {
    constructor() {
        super()
        // this.doLogError()
    }

    registerUser(type, account, password, nickname) {
        return new Promise((resolve, reject) => {
            //超级管理创建
            this.usermodel.findOne({auth: 100}, (e, d) => {
                if (d) {
                    reject(`超级管理已存在`)
                    return
                }
                let secret_key = this.doCreateSecretKey(nickname)
                let secret_password = this.doCodeInfo(password, secret_key)
                this._createUser(account, secret_password, secret_key, 100, nickname, (data) => {
                    let token = jwt.sign({name: "user", data: data}, 'santa', {expiresIn: 60 * 60 * 24 * 3600})
                    resolve(token)
                }, (e) => {
                    reject(this.toJson(e))
                })
            })
        })
    }

    deleteUser(id) {
        return new Promise((resolve, reject) => {
            this.usermodel.deleteMany({test: {$in: id}}, (e, d) => {
                console.log(e)
                if (e) {
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }

    getUserList() {
        return new Promise((resolve, reject) => {
            this.usermodel.find({}, (e, d) => {
                if (e) {
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }

    getUserInfo(id) {
        return new Promise((resolve, reject) => {
            this.usermodel.find({_id: id}, (e, d) => {
                if (e) {
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }

    doUserLogin(account, password) {
        return new Promise((resolve, reject) => {
            this.sysmodel.findOne({account: account}, (e, d) => {
                if (!d) {
                    reject('用户名错误')
                    return
                }
                if (e) {
                    reject(this.toJson(e))
                    return
                }
                let pwd = this.doCodeInfo(password, d.secret)
                if (d.password != pwd) {
                    reject(`用户密码错误`)
                    return
                }
                let token = jwt.sign({name: "user", data: d}, 'santa', {expiresIn: 60 * 60 * 24 * 3600})
                resolve(token)
            })
        })
    }

    doUserAutoLogin(token, to) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'santa', (e, d) => {
                if (e) {
                    reject('权限验证出错')
                    return
                }
                let {account, password} = d.info
                this.usermodel.find({account: account, password: password}, (e, d) => {
                    if (to === 'admin') {
                        if (d.auth != 'admin' || d.auth != 'superadmin') {
                            reject('用户权限出错')
                            return
                        }
                    }
                    if (e || d.length === 0) {
                        reject('登陆时效过期，请重新登陆')
                        return
                    }
                    resolve(1)
                })
            })
        })
    }

    _createUser(account, password, secret, auth, nickname, successCb, failCb) {
        this.usermodel.create({
            account,
            password,
            nickname,
            auth,
            secret,
            created_time: +new Date(),
            update_time: +new Date()
        }, (e, d) => {
            if (e) {
                failCb(e)
                return
            }
            successCb(d)
        })
    }
}

module.exports = User