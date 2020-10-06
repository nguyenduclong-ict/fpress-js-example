const { execSync } = require('child_process')
const multer = require('multer')
const path = require('path')
const { CustomError } = require('fpress')

// Setup multer
const uploadPath = process.env.UPLOAD_PATH
const MIME_TYPE_MAP = [
    /image\/(jpg|jpeg|png|gif)/,
    /video\/*/,
    /audio\/*/,
    /\.zip/,
    /text\/*/,
    /application\/*/,
]

// Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const now = new Date()
        const { user } = req
        const arr = []
        // Prepare upload dir
        if (user) {
            const userPath = user.username
            const timePath = `${now.getFullYear()}-${now.getMonth() + 1}`
            arr.push('private', userPath, timePath)
        } else {
            arr.push('anonymus')
        }
        const des = path.join(uploadPath, ...arr)
        execSync(`mkdir -p ${des}`)
        cb(null, des)
    },
    filename: (req, file, cb) => {
        const { name, ext } = path.parse(file.originalname)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const filename = `${uniqueSuffix}-${name}${ext}`
        cb(null, filename)
    },
})

function fileFilter(req, file, cb) {
    if (!MIME_TYPE_MAP.find((mimetype) => mimetype.test(file.mimetype))) {
        return cb(
            new CustomError({
                code: 422,
                message: 'Không hỗ trợ định dạng file',
            }),
            false
        )
    }
    cb(null, true)
}
const upload = multer({ storage, fileFilter })

module.exports = { upload, storage }
