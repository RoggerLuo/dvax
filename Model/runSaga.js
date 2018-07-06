import { put, takeEvery, call } from 'redux-saga/effects'
import invariant from 'invariant'

export default (sagaMiddleware,namespace,config) => (key, cb) => {
    invariant(typeof(key) === 'string', `the first arg of saga should be string`)
    invariant(typeof(cb) === 'function', `the second arg of saga should be function`)
    sagaMiddleware.run(createSaga())
    function createSaga() {
        function prefixedPut(action) {
            action.type = `${namespace}/${action.type}`
            return put(action)
        }
        function* saga(action) {
            yield cb(action,{ ...config.sagaMethod, ...config.saga, put: prefixedPut, call })  //注入参数
        }
        return function*() {
            yield takeEvery(`${namespace}/${key}`,saga)
        }
    }
}

