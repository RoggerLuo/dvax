import sagaParams from './sagaParams'
import { connect } from 'react-redux'
import invariant from 'invariant'
import { call } from 'redux-saga/effects'

import React from 'react'
export default function(store,sagaMiddleware,config){
    return { 
        put: store.dispatch,
        dispatch: store.dispatch,
        connect: _connect,
        get,
        change,
        reduce,
        fetch,
        run
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
                throw `\n\n model"${namespace}"的run方法出错，\n\n 出错的Generator为: \n\n ${saga.toString()}`
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
        invariant(value !== undefined,'Model change方法需要传入value')
        store.dispatch({ type: `${namespace}/change`, key, value })
    }
    function reduce(namespace,reducer){
        invariant(typeof(namespace) == 'string','Model reduce方法需要传入namespace，为string')
        invariant(namespace && reducer,'Model reduce方法需要传入namespace，reducer')
        store.dispatch({ type: `${namespace}/std`, reducer })
    }
    function _connect(namespace){
        let mapToState
        if(typeof(namespace) == 'function') {
            mapToState = namespace
            return connect(mapToState)
        }
        if(typeof(namespace) == 'string') {
            mapToState = state => state[namespace]
        }
        if(!namespace){
            return connect()
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
            const CompContainer = props => <Comp {...props} {...params}/>
            return connect(mapToState)(CompContainer)
        }
    }
}
