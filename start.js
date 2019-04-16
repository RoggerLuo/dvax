import invariant from 'invariant'
import React from 'react'
import { Provider } from 'react-redux'
import getToast from './toast/getComponent'
let alreadyConfigured = false
let alreadyStarted = false
export function config(configObj){
    invariant(!alreadyConfigured,'dvax已经config过一次了')
    alreadyConfigured = true

    invariant(typeof(configObj) ==='object','config文件应该为object')
    Object.keys(configObj).forEach(key=>{
        this._config[key] = configObj[key]               
    })

}

function start(Component,config={}){
    invariant(Component,'dvax.start第一个参数不能为空，需传入react组件')
    // invariant(!alreadyStarted,'dvax已经初始化过一次了')
    if(!alreadyStarted) {
        alreadyStarted = true
        this._onStart.forEach(cb=>{
            cb && cb()
        })
    }
    const Toast = getToast(this._model)
    return (
        <Provider store={this._store}>
            <div style={{height:'100%'}}>
                {Component}
                <Toast/>
            </div>
        </Provider>
    )
}
export function connect(Component,config={}){ //另一种start方式，start的名字要改了
    invariant(Component,'dvax.start第一个参数不能为空，需传入react组件')
    // invariant(!alreadyStarted,'dvax已经初始化过一次了')
    if(!alreadyStarted) {
        alreadyStarted = true
        this._onStart.forEach(cb=>{
            cb && cb()
        })
    }
    return (props)=>(
        <Provider store={this._store}>
            <div style={{height:'100%'}}>
                <Component {...props}/>
            </div>
        </Provider>
    )
}
export function onStart(cb){
    this._onStart.push(cb)
}

export default start 