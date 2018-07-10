import { put, takeEvery, call } from 'redux-saga/effects'
import invariant from 'invariant'

export default (sagaMiddleware,namespace,config) => (key, cb) => {
    invariant(typeof(key) === 'string', `the first arg of saga should be string`)
    invariant(typeof(cb) === 'function', `the second arg of saga should be function`)
    sagaMiddleware.run(createSaga())
    function createSaga() {
        function* saga(action) {
            const injectParams = { put: prefixedPut, dispatch: prefixedPut, change, reduce, call } // 保留put兼容老版本代码
            yield cb(action,{ 
                ...config.sagaMethod,
                ...config.effects,
                ...injectParams
            })  //注入参数
        }
        return function*() {
            yield takeEvery(`${namespace}/${key}`,saga)
        }
    }
    function prefixedPut(action) {
        action.type = `${namespace}/${action.type}`
        return put(action)
    }
    function change(key,value){
        invariant(key,'change方法需要传入namespace，key')
        invariant(value !== undefined,'change方法需要传入value')
        return put({ type: `${namespace}/change`, key, value })
    }
    function reduce(reducer){
        invariant(reducer,'reduce方法需要传入reducer')
        return put({ type: `${namespace}/std`, reducer })
    }
}
