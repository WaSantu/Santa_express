const LinkS = require('../../model/link/link')
let Link = new LinkS()
const LinkController = (app) => {
    app.post('/api/link/register',Link.checkParmasName([{val:'link_name',text:'昵称'},{val:'link_site',text:'网址链接'},{val:'link_des',text:'站点描述'},{val:'link_mail',text:'邮箱'}]),async (req,res)=>{
        try{
            let {link_name,link_site,link_des,link_mail} = req.body
            let re = await Link.doCreateLink(link_site,link_name,link_des,link_mail)
            res.json({code:200,msg:'申请成功'})
        }catch (e){
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/admin/link/status',async (req,res)=>{
        try{
            let {ids,status} = req.body
            let re = await Link.doChangeStatus(ids,status)
            res.json({code:200,msg:'审核成功'})
        }catch (e) {
            res.json({code:201,msg:e})
        }
    })
}

module.exports = LinkController