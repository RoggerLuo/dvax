import invariant from 'invariant'
import wrapReducer from './wrapReducer'
import mutate from '../../mutate'
export default function(arr,namespace,reducers={}) {
    const nameConflict = Object.keys(reducers).some(type => ['change', 'std'].indexOf(type) != -1)
    invariant(!nameConflict, `reducer:[${namespace}]的方法名冲突，请勿使用"change"和"std"作为方法名`)        

    arr.push(wrapReducer(`${namespace}/change`,changeReducer))
    arr.push(wrapReducer(`${namespace}/std`,stdReducer))
}
function stdReducer(state,action){
    return action.reducer(state)
}
function changeReducer(state,{ key, value }){
    if(
        key.indexOf('.') !== -1 ||
        key.indexOf('[') !== -1 
    ) {
        return mutate(state).with(key,value).done()
    }
    const obj = {}
    obj[key] = value
    return { ...state, ...obj }
}