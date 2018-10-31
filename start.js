import invariant from 'invariant'
import React from 'react'
import { Provider } from 'react-redux'
import getToast from './toast/getComponent'
let alreadyStarted = false
function start(Component,config={}){
    invariant(Component,'dvax.start第一个参数不能为空，需传入react组件')
    // invariant(!alreadyStarted,'dvax已经初始化过一次了')
    if(!alreadyStarted) {
        alreadyStarted = true
        invariant(typeof(config) ==='object','config文件应该为object')
        Object.keys(config).forEach(key=>{
            this._config[key] = config[key]               
        })
        this._onStart.forEach(cb=>{
            cb && cb()
        })
    }
    const Toast = getToast(this._model)
    return (
        <Provider store={this._store}>
            <div style={{height:'100%'}}>
                <Component/>
                <Toast/>
            </div>
        </Provider>
    )
}
export function onStart(cb){
    this._onStart.push(cb)
}
export default start 