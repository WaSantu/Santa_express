const SiteCommon = require('../common/common')

class Media extends SiteCommon {
    constructor() {
        super()
    }
    doCreateMedia(name,link,id){
        return new Promise((resolve, reject) => {
            this.mediamodel.create({
                name:name,
                link:link,
                creator_id:id
            },(e,d)=>{
                if(e){
                    reject(`创建媒体文件失败`)
                    return
                }
                resolve(d)
            })
        })
    }
}

module.exports = Media