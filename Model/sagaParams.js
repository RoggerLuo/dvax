import { put, call } from 'redux-saga/effects'
import invariant from 'invariant'

export default (namespace,store) => {
    return { put: prefixedPut, dispatch: prefixedPut, change, reduce, call, get }   
    function prefixedPut(action) {
        action.type = `${namespace}/${action.type}`
        return put(action)
    }
    function change(key,value){
        invariant(key,'change方法需要传入namespace，key')
        invariant(value !== undefined,'change方法需要传入value')
        return put({ type: `${namespace}/change`, key, value })
    }
    function reduce(reducer){
        invariant(reducer,'reduce方法需要传入reducer')
        return put({ type: `${namespace}/std`, reducer })
    }
    function get(_namespace){
        if(!_namespace) return store.getState()[namespace]
        return store.getState()[_namespace]
    }

}
