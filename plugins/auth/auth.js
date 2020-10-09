const { UserProvider } = require('@/data/User')
const { arrayArgs } = require('@/utils')
const { CustomError } = require('fpress/dist')
const _ = require('lodash')
const jwt = require('../jwt')

/**
 *
 * @param {*} roles
 * @param {{rule}} options
 */
function MAuth(roles, options) {
    options = _.defaultsDeep(options, {
        rule: 'or',
    })
    /**
     * @param {Request} req;
     * @param {Response} res;
     * @param {NextFunction} next
     * */
    return async function (req, res, next) {
        if (!req.user) {
            // get User info
            const token = _.get(req, 'headers.authorazition', '').split(' ')
            if (token) {
                const { id } = jwt.verify(token)
                req.user = await UserProvider.findOne({ _id: id }, null, {
                    populate: ['roles'],
                })
            }
        }

        if (roles && !req.user) {
            return next(
                new CustomError({
                    code: 401,
                    message: 'Bạn không có quyền truy cập tài nguyên',
                })
            )
        }

        if (
            roles &&
            !checkRole(
                req.user.roles.map((r) => r.name),
                roles,
                options.rule
            )
        ) {
            return next(
                new CustomError({
                    code: 401,
                    message: 'Bạn không có quyền truy cập tài nguyên',
                })
            )
        }

        // Check role
        next()
    }
}

function checkRole(source, data, rule = 'or') {
    source = arrayArgs(source)
    data = arrayArgs(data)

    if (rule === 'or') {
        return data.some((role) => source.includes(role))
    }

    if (rule === 'and') {
        return data.every((role) => source.includes(role))
    }

    return flase
}

class AuthUser {
    user
    constructor(user) {
        this.data = user
    }

    is(role) {
        return !!_.get(this.data, 'roles', []).find(
            (item) => item.name === role
        )
    }

    get(path, defaultData) {
        return _.get(user, path, defaultData)
    }

    set(path, value) {
        _.set(this.user, path, value)
    }
}

module.exports = { MAuth, AuthUser }
