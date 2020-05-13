const SiteCommon = require('../common/common')

class Tag extends SiteCommon {
    constructor() {
        super()
    }
    doCreateTag(id,name,is_hot=0){
        return new Promise(async (resolve, reject) => {
            let result = this._checkTag(name)
            if(result === 1){
                this.tagmodel.create({
                    name:name,
                    is_hot:is_hot,
                    creator_id:id,
                    create_time:+new Date(),
                    update_time:+new Date()
                },(e,d)=>{
                    if(e){
                        reject(this.toJson(e))
                        return
                    }
                    resolve(d)
                })
            }
        })
    }
    doUpdateTag(id,name,is_hot){
        return new Promise(async (resolve, reject) => {
            let result = this._checkTag(name)
            if(result === 1){
                this.tagmodel.update({_id:id},{name:name},(e,d)=>{
                    if(e){
                        reject(this.toJson(e))
                        return
                    }
                    resolve(d)
                })
            }
        })
    }
    _checkTag(name){
        return new Promise((resolve, reject) => {
            this.tagmodel.find({name:name},(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                if(d.length != 0){
                    reject('标签名称已存在')
                    return
                }
                resolve(1)
            })
        })
    }
}

module.exports = Tag