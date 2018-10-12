import React from 'react'
import { Model } from './index.js'
import invariant from 'invariant'
export default (namespace,View) => {
    const component = ({ placeholder,fieldName, callback, change, get, ...rest }) => {
        invariant(!!fieldName,'fieldName不合法')
        const value = rest[fieldName]
        const onChange = (e) => {
            let val = e.target.value
            const oldValue = get()[fieldName] || ''
            if(callback) 
                val = callback(val,oldValue)
            change(fieldName,val)
        }
        return <View onChange={onChange} value={value||''} placeholder={placeholder}/>
    }
    return Model.connect(namespace)(component)
}
