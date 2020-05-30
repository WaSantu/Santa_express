//api路由权限验证
const jwt = require('jsonwebtoken')
const docrypto = require('../crypto/crypto')
function auth(arg){
    return function(req,res,next){
        let request_url = req.originalUrl
        let is_admin_request = request_url.slice(5,10)
        if(is_admin_request === 'admin'){
            if(!req.headers.authorization){
                res.json({code:201,msg:'登陆失效或未授权请求'})
                return
            }
            let encode_token = req.headers.authorization.split(' ')[1]
            jwt.verify(encode_token,'santa',(e,d)=>{
                if(e){
                    res.json({code:401,msg:'登陆失效过期或未授权请求'})
                    return
                }
                req.user = d.data
                next()
            })
        }else{
            next()
        }

    }
}

module.exports =auth