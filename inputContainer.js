import React from 'react'
import { connect, Model } from 'dvax'

export default (View,reducerName,fieldName,callback) => {
    const component = ({ value }) => {
        const onChange = (e) => {
            let val = e.target.value
            const oldValue = Model.get(reducerName)[fieldName] || ''
            if(callback) 
                val = callback(val,oldValue)
            Model.change(reducerName,fieldName,val)
        }
        return <View onChange={onChange} value={value}/>
    }
    const mapTo = (state) => {
        return { value: state[reducerName][fieldName] }
    } 
    return connect(mapTo)(component)
}
