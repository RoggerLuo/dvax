import React from 'react'
import { Model } from './index.js'

export default (View,namespace,fieldName,callback) => {
    const component = ({ value }) => {
        const onChange = (e) => {
            let val = e.target.value
            const oldValue = Model.get(namespace)[fieldName] || ''
            if(callback) 
                val = callback(val,oldValue)
            Model.change(namespace,fieldName,val)
        }
        return <View onChange={onChange} value={value}/>
    }
    const mapTo = (state) => ({ value: state[namespace][fieldName] })
    return Model.connect(mapTo)(component)
}
