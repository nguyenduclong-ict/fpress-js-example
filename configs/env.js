const path = require('path')
const ROOT = process.cwd()

const dev = {
    ROOT,
    ROUTER_PATH: path.join(ROOT, 'routes'),
    STATIC_PATH: path.join(ROOT, 'public'),
}

const prod = {
    ROOT,
    ROUTER_PATH: path.join(ROOT, 'routes'),
    STATIC_PATH: path.join(ROOT, 'public'),
}

const env = process.env.NODE_ENV.toLowerCase() === 'dev' ? dev : prod

Object.assign(process.env, env)

module.exports = env
