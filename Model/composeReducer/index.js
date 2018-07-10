import invariant from 'invariant'
import injectDefaultReducers from './injectDefaultReducers'
import wrapReducer from './wrapReducer'

export default function({ reducers, state, namespace }) {
    const defaultState = state || {}
    reducers = reducers || {}
    invariant(namespace, `reducer's property namespace can't find`)
    const reducersArr = Object.keys(reducers)
        .map(key => {
            const reducer = reducers[key]
            const type = `${namespace}/${key}`
            return wrapReducer(type,reducer) //嵌入判断type的逻辑
        }) 
    injectDefaultReducers(reducersArr,namespace,reducers)
    const modelReducer = reduceReducers(...reducersArr) //数组克隆
    return (state=defaultState,action) => modelReducer(state, action) //最后的包装函数，为了能装载上默认值
}

function reduceReducers(...reducersArr) {
    //传入初始状态"previous", 当前执行的action
    return (previous,action) => { 
        /* 把所有的reduce从头到尾跑了一遍，校验type的逻辑写在了函数实例里面 */
        return reducersArr.reduce((state,reducer) => reducer(state,action),previous)
    }   
}