const UserApi = require('./user/user')
const SysApi = require('./sysset/sysset')
const TagApi = require('./tag/tag')
const ArticalApi = require('./artical/artical')
const CommentApi = require('./comment/comment')
const LinkApi = require('./link/link')
const MergeApi = (app) =>{
    UserApi(app)
    SysApi(app)
    TagApi(app)
    ArticalApi(app)
    CommentApi(app)
    LinkApi(app)
}

module.exports = MergeApi