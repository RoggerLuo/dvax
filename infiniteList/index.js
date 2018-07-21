import invariant from 'invariant'
import React from 'react'
import { Model } from '../index.js'
import InifiniteList from './InifiniteList'
import model from './model'
export default function(cbs){
    invariant(typeof(cbs.fetchData) === 'function','传入参数需要实现fetchData,一个generator')
    invariant(typeof(cbs.refresh) === 'function','传入参数需要实现refresh,一个generator')
    const getRandomString = () => Math.random().toString(36).substr(2)
    const namespace = getRandomString()
    Model.create(model(namespace,cbs))
    const Component = Model.connect(namespace)(InifiniteList)
    function fetchData(){
        Model.put({ type: `${namespace}/fetchData` })
    }
    function refresh(params={}){
        Model.put({ ...params,type: `${namespace}/refresh`})
    }
    return { component: Component, fetchData, refresh }
}
