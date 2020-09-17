const Artical = require('../../model/artical/artical')
let ArticalModel = new Artical()
const ArticalController = (app) =>{
    app.post('/api/admin/artical/opreate',ArticalModel.checkParmasName([{val:'title',text:'标题'},{val:'content_html',text:'文章内容'}]),async (req,res)=>{
        try{
            let {title,content_text,content_html,tag,is_stick,artical_img,status,type} = req.body
            let id = null
            let msg = '新建成功'
            if(type == 2){
                id = req.body.id
                msg = '修改成功'
            }
            let re = await ArticalModel.doArtical(title,content_text,content_html,tag,is_stick,artical_img,status,type,id)
            res.json({code:200,msg:msg,data:re})
        }catch (e){
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/artical/get',async (req,res)=>{
        try{
            let re = await ArticalModel.doGetArticalInfo(req.body.id)
            res.json({code:200,data:re})
        }catch (e) {
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/admin/artical/status',async (req,res)=>{
        try{
            let {id,status} = req.body
            let re = await ArticalModel.doChangeStatus(id,status)
            res.json({code:200,msg:'修改成功'})
        }catch (e){
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/admin/artical/list',async (req,res)=>{
        try{
            let {page,status,keyword} = req.body
            let re = await ArticalModel.doGetList(status,page,keyword)
            res.json({code:200,data:re})
        }catch (e){
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/artical/time',async (req,res)=>{
        try{
            let re = await ArticalModel.doGetDate()
            res.json({code:200,data:re})
        }catch (e) {
            console.log(e)
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/artical/list_time',async (req,res)=>{
        try{
            let {start_time} = req.body
            let end_time = {}
            if(start_time.month == 12){
                end_time.month = '1'
                end_time.year = String(+start_time.year + 1)
            }else{
                end_time.month = (+start_time.month+1)<10?`0${+start_time.month+1}`:+start_time.month+1
                end_time.year = start_time.year
            }
            month = start_time.month<10?`0${start_time.month}`:start_time.month
            let start = `${start_time.year}-0${month}-01T00:00:00`
            let end = `${end_time.year}-${end_time.month}-01T00:00:00`
            let re = await ArticalModel.doGetListByDate(start,end)
            res.json({code:200,data:re})
        }catch (e) {
            res.json({code:201,msg:e})
        }
    })
}

module.exports = ArticalController