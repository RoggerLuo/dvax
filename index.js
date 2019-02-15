import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { connect } from 'react-redux'
import getModel from './Model/index.js'
import start, { onStart, config } from './start.js'
const app = {
    _model:null,
    _store: null,
    _onStart: [],
    _config: { effects: {} }, //初始值，后面会用到
    config,
    onStart,
    start
} 
const sagaMiddleware = createSagaMiddleware()
app._store = createStore(a => a, applyMiddleware(sagaMiddleware))

const _connect = reducerName => {
    if(typeof(reducerName) == 'function') {
        return connect(reducerName)
    }
    if(!reducerName) return connect(state=>state)
    return connect(state=>state[reducerName])
}

export const Model = getModel(app._store,app._config,sagaMiddleware)
app._model = Model
export { connect }
export default app
