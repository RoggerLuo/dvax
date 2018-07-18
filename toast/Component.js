import invariant from 'invariant'
import React from 'react'
import Fade from '../fade.js'
import s from './style.css'
import okPng from './ok.png'
import notOkPng from './notok.png'
import { connect } from 'react-redux'

export default connect(state => state['dvaxToast'])(props=>{
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
