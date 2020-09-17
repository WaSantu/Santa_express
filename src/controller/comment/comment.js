
const Comment = require('../../model/comment/comment')
let comment = new Comment()
const CommentController = (app) =>{
    app.post('/api/comment/post',comment.checkParmasName([{val:'form_user',text:'评论人'},{val:'content',text:'评论内容'}]),async (req,res)=>{
        try{
            let {artical_id,form_user,from_website,from_email,content,to_user,to_user_mail} = req.body
            let re = await comment.doCreateComment(artical_id,form_user,from_website,from_email,content,to_user,to_user_mail)
            res.json({code:200,data:re})
        }catch (e) {
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/admin/comment/list',async (req,res)=>{
        try{
            let {page,status} = req.body
            let re = await comment.doGetList(page,status)
            res.json({code:200,data:re})
        }catch (e) {
            console.log(e)
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/admin/comment/change',async (req,res)=>{
        try{
            let {ids,status} = req.body
            let re = await comment.doChangeStatus(ids,status)
            res.json({code:200,msg:'修改成功'})
        }catch (e) {
            res.json({code:201,msg:e})
        }
    })
}

module.exports = CommentController