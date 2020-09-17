const SiteCommon = require('../common/common')
const mongoose = require('mongoose')

class Tag extends SiteCommon {
    constructor() {
        super()
    }

    /**
     * @description 创建标签
     * @param name 标签名称
     */
    doCreateTag(name) {
        return new Promise(async (resolve, reject) => {
            let result = await this._checkTag(name)
            if(result.status != 1) {
                reject(result.msg)
                return
            }else{
                this.tagmodel.create({
                    name: name,
                }, (e, d) => {
                    if (e) {
                        reject(this.toJson(e))
                        return
                    }
                    resolve(d)
                })
            }
        })
    }

    /**
     * @description 修改标签
     * @param id {string} 标签id
     * @param name {string} 标签名字
     * @returns {Promise<unknown>}
     */
    doUpdateTag(id, name,) {
        return new Promise(async (resolve, reject) => {
            let result = await this._checkTag(name)
            if(result.status != 1){
                reject(result.msg)
                return
            }else{
                this.tagmodel.updateOne({_id: id}, {name: name}, (e, d) => {
                    console.log(e,d)
                    if (e) {
                        reject(this.toJson(e))
                        return
                    }
                    resolve(d)
                })
            }
        })
    }

    /**
     * @description 删除标签
     * @param {array} ids 数组
     */
    doDeleteTag(ids){
        console.log(ids)
        return new Promise((resolve,reject)=>{
            this.tagmodel.deleteMany({_id:{$in:ids}},(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve('ok')
            })
        })
    }
    doGetByTag(tagid){
        return new Promise((resolve, reject) => {
            // this.articalmodel.find({ "tag": { $elemMatch: { "tag_id": mongoose.Types.ObjectId(tagid) } } },(e,d)=>{
            //     console.log(e,d)
            // })
            this.articalmodel.aggregate([{
                $match:{
                    'tag.tag_id':mongoose.Types.ObjectId(tagid)
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
                    comment:0,
                    tag:0
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

    _checkTag(name) {
        return new Promise((resolve, reject) => {
            this.tagmodel.findOne({name: name}, (e, d) => {
                if (e) {
                    resolve({status:0,msg:e})
                    return
                }
                if (d) {
                    resolve({status:0,msg:'已存在此标签名'})
                    return
                }
                resolve({status:1,msg:''})
            })
        })
    }
}

module.exports = Tag