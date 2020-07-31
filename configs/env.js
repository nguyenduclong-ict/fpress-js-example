const path = require('path')
const ROOT = process.cwd()

const dev = {
    ROOT,
    ROUTER_PATH: path.join(ROOT, 'routes'),
}

const prod = {
    ROOT,
    ROUTER_PATH: path.join(ROOT, 'routes'),
}

const env = process.env.NODE_ENV === 'dev' ? dev : prod

Object.assign(process.env, env)

module.exports = env
