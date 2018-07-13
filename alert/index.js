import invariant from 'invariant'
import React from 'react'
import { Model } from 'dvax'
import Fade from 'dvax/fade'
import './style.css'
import okPng from './ok.png'
import notOkPng from './notok.png'
Model.create({
    namespace:'dvaxAlert',
    state:{ status:false, message:'baaabbasdfsasdfsadfsfbbb', show:false },
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
export function alert(message,duration,status){
    if(Model.get('dvaxAlert').show) return
    invariant(message,'提示信息不能为空[from dvax/alert]')
    invariant(duration,'持续时间不能为空[from dvax/alert]')
    Model.dispatch({type:'dvaxAlert/alert',status,message})
    setTimeout(function(){
        Model.put({type:'dvaxAlert/hide'})
    },duration)
    setTimeout(function(){
        Model.put({type:'dvaxAlert/clear'})
    },duration+400)
}
const Component = Model.connect('dvaxAlert')(props=>{
    return (
        <Fade duration={300} show={props.show} className={"dvax-alert-wrap"}>
            <div className="dvax-alert-content">
                <div>
                    {props.status=='good'?(<img src={okPng} style={{marginBottom:'10px',width:'40px'}}/>):null}
                    {props.status=='bad'?(<img src={notOkPng} style={{marginBottom:'10px',width:'40px'}}/>):null}
                </div>
                {props.message}
            </div>
        </Fade>
    )
})
export default Component

