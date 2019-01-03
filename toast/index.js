import invariant from 'invariant'
import React from 'react'
import { Model } from '../index.js'
// let showing = false

export default function(message,duration,status){
    // if(showing) return
    // showing = true

    if(Model.get('dvaxToast').show) return
    invariant(message,'提示信息不能为空[from dvax/toast]')
    invariant(duration,'持续时间不能为空[from dvax/toast]')
    Model.dispatch({type:'dvaxToast/show',status,message})
    setTimeout(function(){
        Model.dispatch({type:'dvaxToast/hide'})
    },duration)
    setTimeout(function(){
        Model.dispatch({type:'dvaxToast/clear'})
    },duration+300)
}