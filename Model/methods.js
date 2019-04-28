import sagaParams from './sagaParams'
import { connect } from 'react-redux'
import invariant from 'invariant'
import { call } from 'redux-saga/effects'
import React from 'react'
import _mutate from '../mutate'

export default function(store,sagaMiddleware,config){
    return { 
        put: store.dispatch,
        dispatch: store.dispatch,
        connect: _connect,
        get,
        change,
        reduce,
        fetch,
        run,
        mutate,
        delete:_delete
    }
    function _delete(namespace,key){
        /* 
            1.key: abc.efg
            2.key: abc[3]
         */
        let index
        let reducer
        if(key.slice(-1)===']'){ // the second situation
            index = key.slice(key.lastIndexOf('[')+1,key.lastIndexOf(']'))
            if(isNaN(index)) {
                throw Error(`index in "${key}" is not a number, please check your key`)
            }
            key = key.slice(0,key.lastIndexOf('['))
            reducer = state => _mutate(state).with(key,data=>{
                if(!(data instanceof Array)) {
                    throw Error(`key "${key}" is not a array, please check your data structure`)
                }
                const newData = [...data]
                newData.splice(index,1)
                return newData    
            }).done()
        }else{
            const delete_key = key.slice(key.lastIndexOf('.')+1)
            key = key.slice(0,key.lastIndexOf('.'))
            reducer = state => _mutate(state).with(key,data=>{
                if(!(data instanceof Object)) {
                    throw Error(`key "${key}" is not object,please check your data structure`)
                }
                const newData = {...data}
                newData[delete_key] = undefined
                return newData    
            }).done()
        }
        store.dispatch({ type: `${namespace}/std`, reducer })
    }
    function mutate(namespace,key,value){
        const reducer = state => _mutate(state).with(key,value).done()
        store.dispatch({ type: `${namespace}/std`, reducer })
    }
    function run(namespace,sageEffect){ 
        invariant(typeof(namespace) === 'string', `Model.run方法第一个参数应该传入namespace`)
        invariant(typeof(sageEffect) === 'function', `run方法应该传入一个generator`)
        function* sagaWrap(action) {
            try{
                yield sageEffect({ 
                    ...config.sagaMethod,
                    ...config.effects, // 注入自定义参数
                    ...sagaParams(namespace,store)
                },action)  
            }catch(err){
                console.log(`\n\n model"${namespace}"的run方法出错\n\n `) //出错的Generator为: \n\n ${sageEffect.toString()}
                console.log(err)
            }
        }
        sagaMiddleware.run(sagaWrap) 
    }
    function fetch(){ // 如果没有实现的话，就会报错
        invariant(false,'fetch还没有配置，请在dvax.start中配置并注入fetch之后再使用saga中的fetch，详见说明：https://github.com/RoggerLuo/dvax')
    }
    function get(namespace){
        if(!namespace) return store.getState()
        return store.getState()[namespace]
    }
    function change(namespace,key,value){
        invariant(namespace && key,'Model change方法需要传入namespace，key')
        // invariant(value !== undefined,'Model change方法需要传入value')
        store.dispatch({ type: `${namespace}/change`, key, value })
    }
    function reduce(namespace,reducer){
        invariant(typeof(namespace) === 'string','Model reduce方法需要传入namespace，为string')
        invariant(namespace && reducer,'Model reduce方法需要传入namespace，reducer')
        store.dispatch({ type: `${namespace}/std`, reducer })
    }
    function _connect(namespace){
        let mapToState
        if(typeof(namespace) === 'function') {
            mapToState = namespace
            return connect(mapToState)
        }
        if(typeof(namespace) === 'string') {
            mapToState = state => {
                if(state[namespace]===undefined) {
                    throw Error(`无法连接Model，因为namespace为"${namespace}"的Model不存在，请检查namespace的拼写`)
                }
                return state[namespace]
            }
        }
        if(!namespace){
            return connect()
        }

        if(typeof(namespace) === 'object') { 
            const namespace__= [...namespace]
            mapToState = state => {
                let finalState = {}
                namespace__.forEach(el=>{
                    finalState = {...finalState,...state[el]}
                })
                return finalState
            }
            namespace = namespace[namespace.length-1] //放在最后，不然变成字符串之后会出事
        }
        return (Comp) => {
            const params = {
                call,
                reduce(reducer){
                    invariant(typeof(reducer) === 'function','reduce方法需要传入一个函数reducer')
                    reduce(namespace,reducer)
                },
                change(key,value){
                    change(namespace,key,value)
                }, 
                run(saga){
                    invariant(typeof(saga) === 'function', `run方法应该传入一个generator`)
                    run(namespace,saga)
                },
                put(action){
                    action.type = `${namespace}/${action.type}`
                    store.dispatch(action)
                },
                get(_namespace){
                    if(!_namespace) return store.getState()[namespace]
                    return store.getState()[_namespace]
                }
            }   
            const Container = props => <Comp {...props} {...params}/>
            return connect(mapToState)(Container)
        }
    }
}
