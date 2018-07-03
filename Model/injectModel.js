import invariant from 'invariant'
import runSaga from './runSaga'
import composeReducer from './composeReducer'
import { combineReducers } from 'redux'

export default function(sagaMiddleware,store,config){
    const reducers = {}
    return (m)=>{
        const runSingleSaga = runSaga(sagaMiddleware,m.namespace,config)
        injectReducer(m,reducers)
        injectSaga(m.effects)
        function injectSaga(effects) {
            if(effects) {
                Object.keys(effects).forEach(key => {
                    runSingleSaga(key, effects[key])
                })                
            }
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
