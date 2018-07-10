import React from 'react'
import { Provider } from 'react-redux'
let alreadyStarted = false
function start(Component,_conf={}){
    invariant(Component,'dvax.start第一个参数不能为空，需传入react组件')
    invariant(!alreadyStarted,'dvax已经初始化过一次了')
    alreadyStarted = true
    invariant(typeof(_conf) ==='object','config文件应该为object')
    Object.keys(_conf).forEach(key=>{
        config[key] = _conf[key]               
    })
    this._onStart.forEach(cb=>{
        cb && cb()
    })
    return (
        <Provider store={this._store}>
            <Component />
        </Provider>
    )
}
export function onStart(cb){
    this._onStart.push(cb)
}
export default start 