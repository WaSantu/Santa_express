const SiteCommon = require('../common/common')

class Comment extends SiteCommon {
    constructor() {
        super()
    }

    /**
     * @description 新增评论
     * @param {string} artical_id 文章id
     * @param {string} form_user 评论者
     * @param {string} from_website 评论者站点
     * @param {string} from_email 评论者邮限
     * @param {string} content 评论内容
     * @param {string} to_user 回复对象
     * @param {string} to_user_mail 回复对象邮限
     */
    doCreateComment(artical_id,form_user,from_website,from_email,content,to_user,to_user_mail){
        return new Promise((resolve, reject) => {
            this.sysmodel.findOne({},(e,d)=>{
                let need_look = 1
                if(e){
                    reject(this.toJson(e))
                    return
                }
                if(d.comment == 1){
                    need_look = 0
                }
                this.commentmodel.create({
                    artical_id:artical_id,
                    form_user:form_user,
                    from_website:from_website,
                    from_email:from_email,
                    content:content,
                    to_user:to_user,
                    to_user_mail:to_user_mail,
                    status:need_look
                },(e,doc)=>{
                    if(e){
                        reject(this.toJson(e))
                        return
                    }
                    let push_data = {}
                    push_data['comment_id'] = doc._id
                    this.articalmodel.updateOne({_id:artical_id},{$push:{comment:push_data}},(e,d)=>{
                        if(e){
                            reject(this.toJson(e))
                            return
                        }
                        resolve(doc)
                        let msg
                        if(need_look== 0){
                            msg=`待审核评论:${content}`
                        }else{
                            msg=`新增评论:${content}`
                        }
                        this.mail(msg)
                        if(to_user_mail){
                            this.mail('您有一条评论被回复啦!',to_user_mail)
                        }
                    })
                })
            })
        })
    }

    /**
     * @description 获取评论列表
     * @param {String} page 页数
     * @param {String} status 评论状态
     * @param {String} keyword 关键词
     */
    doGetList(page,status,keyword=''){
        let pagesize = 2
        let skip_page = (page - 1)*pagesize
        let key = new RegExp(keyword,'i')
        let query = {}
        if(status != ''){
            query = {status:String(status)}
        }
        return new Promise((resolve, reject) => {
            this.commentmodel.aggregate([{
                $match:query
            },{
                $skip:skip_page
            },{
                $limit:pagesize
            }],(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(d)
            })
        })
    }
    doChangeStatus(ids,status){
        return new Promise((resolve, reject) => {
            this.commentmodel.updateMany({_id:{$in:ids}},{
                status:status
            },(e,d)=>{
                if(e){
                    reject(this.toJson(e))
                    return
                }
                resolve(1)
            })
        })
    }
}

module.exports = Comment