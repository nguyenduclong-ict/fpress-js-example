const express = require('express')
const router = express.Router()
const { upload, createImageThumbnails } = require('@/plugins/upload')
const { MediaProvider } = require('@/data/Media')
const path = require('path')
const { MAuth } = require('@/plugins/auth/auth')

// ------- Declare router -------
router.post('/upload', upload.single('file'), handleUploadMedia)
router.delete('/delete/:name', MAuth(), handleDeleteMedia)
router.get('/:name', MAuth(), handleGetMedia)
router.get('/:name/:thumbnail', MAuth(), handleGetThumbnail)
// ------------------------------

// Handle
/**
 * @param {express.Request} req;
 * @param {express.Response} res;
 * @param {express.NextFunction} next
 * */
async function handleUploadMedia(req, res, next) {
    const { user } = req
    try {
        const file = req.file
        const f = {
            name: file.filename,
            path: file.path,
            mimeType: file.mimetype.split('/').shift(),
            ext: path.extname(file.filename),
            createdBy: _.get(user, '_id'),
        }
        f.thumbnails = await createImageThumbnails(f)
        const rs = await MediaProvider.createOne(f)
        return res.json(rs)
    } catch (error) {
        return next(error)
    }
}

/**
 * @param {express.Request} req;
 * @param {express.Response} res;
 * @param {express.NextFunction} next
 * */
async function handleDeleteMedia(req, res, next) {}

/**
 * @param {express.Request} req;
 * @param {express.Response} res;
 * @param {express.NextFunction} next
 * */
async function handleGetMedia(req, res, next) {
    try {
        const { name } = req.params
        const { user } = req
        const file = await MediaProvider.findOne({
            name,
        })
        if (!file) {
            return res.sendStatus(404)
        }
        res.sendFile(path.resolve(process.env.UPLOAD_PATH, file.path))
    } catch (error) {
        return next(error)
    }
}

/**
 * @param {express.Request} req;
 * @param {express.Response} res;
 * @param {express.NextFunction} next
 * */
async function handleGetThumbnail(req, res, next) {
    try {
        const { name, thumbnail } = req.params
        const { user } = req
        const file = await MediaProvider.findOne({
            name,
        })
        if (!file) {
            return res.sendStatus(404)
        }
        res.sendFile(
            path.resolve(process.env.UPLOAD_PATH, file.thumbnails[thumbnail])
        )
    } catch (error) {
        return next(error)
    }
}

module.exports = router
