const express = require('express')
const router = express.Router()
const jwt = require('@/plugins/jwt')
const bcrypt = require('@/plugins/bcrypt')
const axios = require('axios').default
const { UserProvider } = require('@/data/User')
const { MAuth } = require('@/plugins/auth/auth')
const { CustomError } = require('fpress')
const { arrayArgs } = require('@/utils')
const { RoleProvider } = require('@/data/Role')

// ------- Declare router -------
router.post('/register', handleRegister)
router.post('/login', handleLogin)
router.post('/facebook', handleFacebookLogin)
router.get('/me', MAuth(), handleInfo)
router.post('/logout', MAuth(), handleLogout)
router.post('/change-password', MAuth(), handleChangePassword)
// ------------------------------
module.exports = router

// HANDLE
/**
 * @param {express.Request} req;
 * @param {express.Response} res;
 * @param {express.NextFunction} next
 * */
async function handleLogin(req, res, next) {
    try {
        let user = await UserProvider.findOne({
            username: req.body.username,
        })

        if (!user) {
            return next(
                new CustomError({
                    code: 401,
                    message: 'Tài khoản không tồn tại',
                })
            )
        }

        if (!user.isActive) {
            return next(
                new CustomError({
                    code: 401,
                    message: 'Tài khoản đang bị khóa',
                })
            )
        }
        if (!(await bcrypt.compare(req.body.password, user.password))) {
            return next(
                new CustomError({
                    code: 401,
                    message: 'Mật khẩu không chính xác',
                })
            )
        }

        const token = jwt.sign({ _id: user._id })

        res.json({
            token,
            user,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @param {express.Request} req;
 * @param {express.Response} res;
 * @param {express.NextFunction} next
 * */
async function handleFacebookLogin(req, res, next) {
    const endpoint = process.env.FACEBOOK_API + '/me'
    try {
        const response = await axios.get(endpoint, {
            params: {
                fields: 'id,name,picture{url}',
                access_token: req.body.token,
            },
        })
        const { id, name, picture } = response.data
        let user = await UserProvider.findOne({
            facebook: id,
        })

        if (!user) {
            // create user if not exist
            user = await UserProvider.createOne(
                {
                    facebook: id,
                    info: {
                        name,
                        avatar: _.get(picture, 'data.url'),
                    },
                    password: 'default',
                },
                { req, res, next }
            )
        }
        const token = jwt.sign({ _id: user._id })
        return res.json({ token, user, success: true })
    } catch (error) {
        console.log(error)
        return next(
            new CustomError({
                message: 'Đăng nhập thất bại',
                code: 401,
            })
        )
    }
}

/**
 * @param {express.Request} req;
 * @param {express.Response} res;
 * @param {express.NextFunction} next
 * */
async function handleInfo(req, res, next) {
    try {
        res.json(req.user)
    } catch (error) {
        next(error)
    }
}

/**
 * @param {express.Request} req;
 * @param {express.Response} res;
 * @param {express.NextFunction} next
 * */
async function handleLogout(req, res, next) {
    if (!req.user) {
        return next(
            new CustomError({
                code: 401,
                message: 'Required Login',
            })
        )
    }
    res.sendStatus(200)
}

/**
 * @param {express.Request} req;
 * @param {express.Response} res;
 * @param {express.NextFunction} next
 * */
async function handleChangePassword(req, res, next) {
    try {
        const { oldPassword, newPassword } = req.body
        const user = await UserProvider.findById(req.user._id)
        if (!user) {
            return next(
                new CustomError({
                    code: 401,
                    message: 'Bạn không quyền với thao tác này!',
                })
            )
        }

        const isSame = await bcrypt.compare(oldPassword, user.password)
        if (!isSame) {
            return next(
                new CustomError({
                    code: 401,
                    message: 'Mật khẩu cũ không chính xác!',
                })
            )
        }

        const password = await bcrypt.hash(newPassword, bcrypt.genSaltSync())
        const update = await UserProvider.updateOne(
            { _id: user._id },
            { password }
        )
        res.json({ success: true })
    } catch (error) {
        next(error)
    }
}

/**
 * @param {express.Request} req;
 * @param {express.Response} res;
 * @param {express.NextFunction} next
 * */
async function handleRegister(req, res, next) {
    let { username, password, profile, roles } = req.body

    roles = arrayArgs(roles)

    if (roles.includes('admin')) {
        return next(
            new CustomError({
                code: 401,
                message: 'Bạn không thể đăng kí tài khoản admin',
            })
        )
    }

    if (await UserProvider.findOne({ username })) {
        return next(
            new CustomError({
                code: 401,
                message: 'Tài khoản đã có người sử dụng',
            })
        )
    }

    try {
        let hash = await bcrypt.hash(password)
        const rolesId = await RoleProvider.find({ name: roles })
        const user = await UserProvider.createOne({
            username,
            password: hash,
            profile,
            roles: rolesId.map((item) => item._id.toString()),
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
        next(
            new CustomError({
                code: 500,
                message: error.message || 'Có lỗi xảy ra',
            })
        )
    }
}
