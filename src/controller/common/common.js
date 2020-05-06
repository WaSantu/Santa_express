
class SiteCommon {
    constructor() {}
    toJson(content){
        return JSON.parse(JSON.stringify(content))
    }
    checkParmas(params){
        return function(req,res,next){
            for(let val of params){
                if(!req.body[val]){
                    res.json({code:201,msg:`缺少参数${val}`})
                    return
                }
            }
            next()
        }
    }
    checkParmasType(params){
        return function(req,res,next){
            for(let val of params){
                if(!req.body[val.val] || typeof req.body[val.val] != val.type){
                    res.json({code:201,msg:`${val.val}参数有误`})
                    return
                }
            }
            next()
        }
    }
}

module.exports = SiteCommon