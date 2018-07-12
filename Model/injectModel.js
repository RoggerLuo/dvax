import invariant from 'invariant'
import runSaga from './runSaga.js'
import composeReducer from './composeReducer/index.js'
import { combineReducers } from 'redux'

export default function(sagaMiddleware,store,config){
    const reducers = {}
    return (m)=>{ // 这里获得model配置信息
        const runSingleSaga = runSaga(sagaMiddleware,m.namespace,config)
        injectReducer(m,reducers)
        injectSaga(m.effects,runSingleSaga)
    }
    function injectSaga(effects,runSingleSaga) {
        if(effects) {
            Object.keys(effects).forEach(key => {
                runSingleSaga(key, effects[key])
            })                
        }
    }
    function injectReducer(m,reducers) {
        invariant(
            Object.keys(reducers).every(key => key !== m.namespace),
            `reducer name:[${m.namespace}] is conflict with other reducers`
        )
        reducers[m.namespace] = composeReducer(m)
        store.replaceReducer(combineReducers({ ...reducers }))
        m.event && m.event.onReady && m.event.onReady(store.dispatch)
    }
}
