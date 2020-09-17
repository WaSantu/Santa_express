const SiteCommon = require('../common/common')

class Link extends SiteCommon {
    constructor() {
        super()
    }

    /**
     * @description 友链创建
     * @param {string} link_site 友链地址
     * @param {string} link_name 友链名称
     * @param {string} link_des 友链描述
     * @param {string} link_mail 友链邮箱
     */
    doCreateLink(link_site,link_name,link_des,link_mail){
        return new Promise(async (resolve, reject) => {
            let re = await this._check(link_site)
            if(re == 1){
                this.linkmodel.create({
                    link_site,link_name,link_des,link_mail
                },(e,d)=>{
                    if(e){
                        reject(this.toJson(e))
                        return
                    }
                    resolve(d)
                    this.mail('有新的友链申请，快去审核')
                })
            }else{
                reject('您已经申请过友链了，请耐心等待')
            }
        })
    }

    /**
     * @description 审核友链
     * @param {array} ids 友链id
     * @param {string} status 友链状态
     */
    doChangeStatus(ids,status){
        return new Promise((resolve, reject) => {
            this.linkmodel.updateMany({_id:{$in:ids}},{
                status:status
            },(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(1)
                if(status == 1){
                    this.linkmodel.find({_id:{$in:ids}},(e,d)=>{
                        this.mail('您的友链申请已通过了哟',d.link_mail)
                    })
                }
            })
        })
    }

    /**
     * @description 获取友链列表
     * @param {string} status 状态
     * @param {string} page 页码
     * @param {string} keywords 关键词
     */
    doGetList(status,page,keywords){
        return new Promise((resolve, reject) => {

        })
    }
    _check(site){
        return new Promise((resolve, reject) => {
            this.linkmodel.findOne({link_site:site},(e,d)=>{
                if(d){
                    resolve(2)
                }else{
                    resolve(1)
                }
            })
        })
    }
}

module.exports = Link