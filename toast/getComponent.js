// import invariant from 'invariant'
import React from 'react'
import Fade from '../fade.js'
import okPng from './ok.png'
import notOkPng from './notok.png'
import { connect } from 'react-redux'

const wrapStyle={
    userSelect: 'none',
    position: 'fixed',
    zIndex: '99999',
    top: '50%',
    left:'50%',
    transform: 'translate(-50%,-50%)'
}

const contentStyle = {
    minWidth: '90px',
    textAlign: 'center',
    padding: '25px',
    borderRadius: '4px',
    background: '#333333e6',
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
    color: 'white',
    fontSize: '14px',
    lineHeight: '1.5'
}

export default Model => {
    if(!Model.get('dvaxToast')){
        const namespace = 'dvaxToast' //+ Date.now()
        Model.create({
            namespace,
            state:{ status:false, message:'', show:false },
            reducers:{
                show(state,{ status, message }){
                    return { ...state, show: true, message, status}
                },
                hide(state){
                    return { ...state, show:false}
                },
                clear(state){
                    // showing = false
                    return { ...state, message:'', status:false}
                }
            }
        })
    } 
    return connect(state => state['dvaxToast'])(props=>{
        return (
            <Fade duration={300} show={props.show} style={wrapStyle}>
                <div style={contentStyle}>
                    <div>
                        {props.status==='good'?(<img src={okPng} alt="" style={{marginBottom:'10px',width:'40px'}}/>):null}
                        {props.status==='bad'?(<img src={notOkPng} alt="" style={{marginBottom:'10px',width:'40px'}}/>):null}
                    </div>
                    {props.message}
                </div>
            </Fade>
        )
    })
}

