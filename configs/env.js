const { defaultsDeep, get } = require('lodash')
const path = require('path')
const ROOT = process.cwd()

const dev = {
    ROOT,
    ROUTER_PATH: path.resolve(ROOT, 'routes'),
    STATIC_PATH: path.resolve(ROOT, 'public'),
    UPLOAD_PATH: path.resolve(ROOT, '../upload'),
}

const prod = {
    ROOT,
    ROUTER_PATH: path.resolve(ROOT, 'routes'),
    STATIC_PATH: path.resolve(ROOT, 'public'),
    UPLOAD_PATH: path.resolve(ROOT, '../upload'),
}

const env = isDev() ? dev : prod
defaultsDeep(process.env, env)

function isDev() {
    const NODE_ENV = get(process.env, 'NODE_ENV', 'dev').toLowerCase()
    return ['dev', 'development'].includes(NODE_ENV)
}

function isProduction() {
    const NODE_ENV = get(process.env, 'NODE_ENV', 'dev').toLowerCase()
    return ['prod', 'production'].includes(NODE_ENV)
}

module.exports = process.env
