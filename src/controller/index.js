const UserApi = require('./user/user')
const MergeApi = (app) =>{
    UserApi(app)
}

module.exports = MergeApi