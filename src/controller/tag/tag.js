
const Tag = require('../../model/tag/tag')
let tag = new Tag()
const TagController = (app) =>{
    app.post('/api/admin/tag/create',tag.checkParmasName([{val:'name',text:'标签名称'}]), async (req,res)=>{
        try {
            let name = req.body.name
            let re = await tag.doCreateTag(name)
            res.json({code:200,msg:'创建成功'})
        }catch (e){
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/admin/tag/edit',tag.checkParmasName([{val:'name',text:'标签名称'},{val:'id',text:'id'}]),async (req,res)=>{
        try{
            let {name,id} = req.body
            let re = await tag.doUpdateTag(id,name)
            res.json({code:200,mgs:'修改成功'})
        }catch (e){
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/admin/tag/delete',tag.checkParmasType([{val:'id',type:'array'}]),async (req,res)=>{
        try{
            let {id} = req.body
            let re = await tag.doDeleteTag(id)
            res.json({code:200,mgs:'删除成功'})
        }catch (e){
            console.log(e)
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/tag/findartical',async (req,res)=>{
        try{
            let {id} = req.body
            let re = await tag.doGetByTag(id)
            res.json({code:200,data:re})
        }catch (e){
            console.log(e)
            res.json({code:201,msg:e})
        }
    })
}

module.exports = TagController