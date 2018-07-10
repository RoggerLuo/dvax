import invariant from 'invariant'
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
    // 因为webpack打包时loader时剔除了node_modules，所以无法使用jsx
    const _Component = React.createElement(Component,{},null)
    return React.createElement(Provider,{store:this._store},_Component)
}
export function onStart(cb){
    this._onStart.push(cb)
}
export default start 