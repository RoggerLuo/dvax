import invariant from 'invariant'
export default function(app) {
    const register = function(obj) {
        invariant( typeof(obj) === 'object', `dva.constant method expect an object `)
        Object.keys(obj).forEach(key => {
            // const reservedKeys = ['_models', '_store', 'model', 'saga', 'connect']
            invariant(Object.keys(app._constants).indexOf(key) === -1, `constant:"${key}"已经存在, 且constants不能被修改`)
            app._constants[key] = obj[key]
        })
    }
    const get = function(key) {
        return app._constants[key]
    }
    return { register, get }
}
