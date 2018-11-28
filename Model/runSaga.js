import { takeEvery } from 'redux-saga/effects'
import invariant from 'invariant'
import sagaParams from './sagaParams'
export default (sagaMiddleware,namespace,config,store) => (key, cb) => {
    invariant(typeof(key) === 'string', `the first arg of saga should be string`)
    invariant(typeof(cb) === 'function', `the second arg of saga should be function`)
    sagaMiddleware.run(createSaga())
    function createSaga() {
        function* saga(action) {
            try{
                yield cb({
                    ...config.sagaMethod,
                    ...config.effects, // 注入自定义参数
                    ...sagaParams(namespace,store) // 覆盖掉原始的sagaMethod，替换change、reduce等方法
                },action)  
            }catch(err){                
                throw `\n\n model"${namespace}"的effect"${key}"出错，\n\n 出错的Generator为: \n\n ${cb.toString()}`
            }
        }
        return function*() {
            yield takeEvery(`${namespace}/${key}`,saga)
        }
    }
}
