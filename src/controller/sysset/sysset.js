const Sysset = require('../../model/sysset/sysset')

let sys = new Sysset()
const SysController = (app) => {
    app.post('/api/sys/init', sys.checkParmasName([{val: 'account', text: '账号'}, {
        val: 'password',
        text: '密码'
    }, {val: 'nickname', text: '昵称'}, {val: 'site_name', text: '标题'}, {val: 'site_des', text: '简介'}, {
        val: 'site_icon',
        text: '图标'
    }]), async (req, res) => {
        try {
            let {account, password, nickname, site_name, site_des, site_icon, send_mail, send_mail_key, comment} = req.body
            let re = await sys.initSiteSysset(account, password, nickname, site_name, site_des, site_icon, send_mail, send_mail_key, comment)
            res.json({code: 200, data: re})
        } catch (e) {
            res.json({code: 201, msg: e})
        }
    })
    app.post('/api/admin/sys/edit', sys.checkParmasName([{val: 'account', text: '账号'}, {
        val: 'nickname',
        text: '昵称'
    }, {val: 'site_name', text: '标题'}, {val: 'site_des', text: '简介'}, {
        val: 'site_icon',
        text: '图标'
    }]), async (req, res) => {
        try {
            let {account, nickname, site_name, site_des, site_icon, send_mail, send_mail_key, comment} = req.body
            let re = await sys.editSiteSysset(account, nickname, site_name, site_des, site_icon, send_mail, send_mail_key, comment)
            res.json({code: 200, msg: '修改成功'})
        } catch (e) {
            res.json({code: 201, msg: e})
        }
    })
    app.post('/api/login', sys.checkParmasName([{val: 'account', text: '账号'}, {
        val: 'password',
        text: '密码'
    }]), async (req, res) => {
        try {
            let {account, password} = req.body
            let re = await sys.doLogin(account, password)
            res.json({code: 200, data: re, msg: '登陆成功'})
        } catch (e) {
            res.json({code: 201, msg: e})
        }
    })
    app.post('/api/admin/auto_login', async (req, res) => {
        try {
            let {account, password} = req.user
            console.log(account, password)
            let re = await sys.doLogin(account, password, 'auto')
            res.json({code: 200, msg: '登陆成功'})
        } catch (e) {
            res.json({code: 201, msg: e})
        }
    })
}

module.exports = SysController