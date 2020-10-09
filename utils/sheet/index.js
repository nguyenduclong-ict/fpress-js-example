require('fpress').registerAlias()
require('dotenv').config()
require('../../configs/env')
const { RoleProvider } = require('../../data/Role')
const mongoService = require('../../services/mongo.service')

mongoService().then(() => {
    // RoleProvider.createOne({
    //     name: 'admin',
    //     description: 'Quản trị viên',
    //     fullPermission: true,
    // })
    // RoleProvider.createOne({
    //     name: 'customer',
    //     description: 'Người dùng',
    // })
})
