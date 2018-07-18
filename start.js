import invariant from 'invariant'
import React from 'react'
import { Provider } from 'react-redux'
import ToastComponent from './toast/Component'
let alreadyStarted = false
function start(Component,config={}){
    invariant(Component,'dvax.start第一个参数不能为空，需传入react组件')
    invariant(!alreadyStarted,'dvax已经初始化过一次了')
    alreadyStarted = true
    invariant(typeof(config) ==='object','config文件应该为object')
    Object.keys(config).forEach(key=>{
        this._config[key] = config[key]               
    })
    this._onStart.forEach(cb=>{
        cb && cb()
    })
    return (
        <Provider store={this._store}>
            <div>
                <Component/>
                <ToastComponent/>
            </div>
        </Provider>
    )
}
export function onStart(cb){
    this._onStart.push(cb)
}
export default start 