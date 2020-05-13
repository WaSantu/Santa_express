const User = require('../../model/usermodel/user')
const jwt = require('jsonwebtoken')
let UserModel = new User()
const test = require('../../model/tag/tag')
let t = new test()
const UserController = (app) =>{
    app.post('/api/user/createadmin',UserModel.checkParmasType([
        {val:'password',type:'string'},
        {val:'account',type:'string'}]),async (req,res)=>{
        console.log(req.test)
        try{
            let {type,account,password,nickname} = req.body
            let create = await UserModel.registerUser(type,account,password,nickname)
            res.json({code:200,msg:'创建用户成功',data:create})
        }catch(e){
            console.log(e)
            res.json({code:201,msg:e})
        }
    })
}

module.exports = UserController