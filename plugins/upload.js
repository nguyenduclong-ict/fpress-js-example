const { execSync } = require('child_process')
const multer = require('multer')
const path = require('path')
const { CustomError } = require('fpress')
const slugify = require('slugify')
const { ObjectId } = require('mongodb')
const sharp = require('sharp')

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
        const timePath = `${now.getFullYear()}-${now.getMonth() + 1}`
        if (user) {
            const userPath = user.username
            arr.push('user', userPath, timePath)
        } else {
            arr.push('anonymus', timePath)
        }
        const des = path.join(uploadPath, ...arr)
        execSync(`mkdir -p ${des}`)
        cb(null, des)
    },
    filename: (req, file, cb) => {
        const { name, ext } = path.parse(file.originalname)
        const uniqueSuffix = Date.now() + '-' + new ObjectId().toHexString()
        const filename = slugify(`${uniqueSuffix}-${name}${ext}`, {
            lower: true,
        })
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

async function createImageThumbnails(file) {
    const { path: originPath, ext } = file
    const thumb = {
        320: `${originPath}`.replace(new RegExp(`${ext}$`), `-320${ext}`),
        128: `${originPath}`.replace(new RegExp(`${ext}$`), `-128${ext}`),
    }
    await Promise.all(
        Object.keys(thumb).map((size) =>
            sharp(originPath).resize(Number(size)).toFile(thumb[size])
        )
    )
    return thumb
}

module.exports = { upload, storage, createImageThumbnails }
