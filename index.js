import 'whatwg-fetch'
// import "babel-polyfill" // 90kb
import "regenerator-runtime/runtime"  //7kb
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { connect } from 'react-redux'
import invariant from 'invariant'
import modelMethod from './Model'
const app = {
    _store: null,
    _constants: {},
    start
} 
let alreadyStarted = false
const config = { effects: {} } //初始值，后面会用到
function start(_conf){
    invariant(!alreadyStarted,'dva已经初始化过一次了')
    alreadyStarted = true
    if(!_conf) return
    invariant(typeof(_conf) ==='object','config文件应该为object')
    Object.keys(_conf).forEach(key=>{
        config[key] = _conf[key]               
    })
}
const sagaMiddleware = createSagaMiddleware()
app._store = createStore(a => a, applyMiddleware(sagaMiddleware))

export const Model = modelMethod(app,config,sagaMiddleware)
export { connect }
export default app
