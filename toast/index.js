import invariant from 'invariant'
import React from 'react'
import { Model } from '../index.js'
import Fade from '../fade.js'
import s from './style.css'
import okPng from './ok.png'
import notOkPng from './notok.png'
Model.create({
    namespace:'dvaxToast',
    state:{ status:false, message:'', show:false },
    reducers:{
        alert(state,{ status, message }){
            return { ...state, show:true, message, status}
        },
        hide(state){
            return { ...state, show:false}
        },
        clear(state){
            return { ...state, message:'', status:false}
        }
    }
})
const Component = Model.connect('dvaxToast')(props=>{
    return (
        <Fade duration={300} show={props.show} className={s.wrap}>
            <div className={s.content}>
                <div>
                    {props.status=='good'?(<img src={okPng} style={{marginBottom:'10px',width:'40px'}}/>):null}
                    {props.status=='bad'?(<img src={notOkPng} style={{marginBottom:'10px',width:'40px'}}/>):null}
                </div>
                {props.message}
            </div>
        </Fade>
    )
})
export { Component as ToastComponent }

export default function(message,duration,status){
    if(Model.get('dvaxToast').show) return
    invariant(message,'提示信息不能为空[from dvax/toast]')
    invariant(duration,'持续时间不能为空[from dvax/toast]')
    Model.dispatch({type:'dvaxToast/toast',status,message})
    setTimeout(function(){
        Model.dispatch({type:'dvaxToast/hide'})
    },duration)
    setTimeout(function(){
        Model.dispatch({type:'dvaxToast/clear'})
    },duration+400)
}