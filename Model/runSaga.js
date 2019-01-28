import { takeEvery } from 'redux-saga/effects'
import invariant from 'invariant'
import sagaParams from './sagaParams'
export default (sagaMiddleware,namespace,config,store) => (key, sageEffect) => {
    invariant(typeof(key) === 'string', `the first arg of saga should be string`)
    invariant(typeof(sageEffect) === 'function', `the second arg of saga should be function`)
    sagaMiddleware.run(createSaga())
    function createSaga() {
        function* sagaWrap(action) {
            try{
                yield sageEffect({
                    ...config.sagaMethod,
                    ...config.effects, // 注入自定义参数
                    ...sagaParams(namespace,store) // 覆盖掉原始的sagaMethod，替换change、reduce等方法
                },action)  
            }catch(err){                
                console.log(`\n\n effect"${namespace}/${key}"方法出错\n\n `) //出错的Generator为: \n\n ${sageEffect.toString()}
                console.log(err)
            }
        }
        return function*() {
            yield takeEvery(`${namespace}/${key}`,sagaWrap)
        }
    }
}
