const User = require('../../model/usermodel/user')
const jwt = require('jsonwebtoken')
let UserModel = new User()
const test = require('../../model/tag/tag')
let t = new test()
const UserController = (app) =>{
    app.post('/api/user/createadmin',UserModel.checkParmas(['password','account','nickname']),async (req,res)=>{
        try{
            let {type,account,password,nickname} = req.body
            let create = await UserModel.registerUser(type,account,password,nickname)
            res.json({code:200,msg:'创建用户成功',data:create})
        }catch(e){
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/login/admin',UserModel.checkParmas(['account','password']),async (req,res)=>{
        try {
            let {password,account} = req.body
            let login = await UserModel.doUserLogin(account,password)
            res.json({code:200,msg:'用户登陆成功',data:login})
        }catch (e) {
            res.json({code:201,msg:e})
        }
    })
    app.post('/api/admin/user/delete',UserModel.checkParmasType([{val:'id',type:'array'}]),async (req,res)=>{
        try {
            if(req.user.auth != 100){
                res.json({code:201,msg:'用户权限不足'})
                return
            }
            let result = await UserModel.deleteUser(req.body.id)
            res.json({code:200,deleteCount:result.deletedCount})
        }catch (e) {
            res.json({code:201,msg:e})
        }
    })
    app.get('/api/admin/user/list',async (req,res)=>{
        try {
            let result = await UserModel.getUserList()
            res.json({code:200,data:result})
        }catch (e) {
            res.json({code:201,msg:e})
        }
    })
}

module.exports = UserController