import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { connect } from 'react-redux'
import invariant from 'invariant'
import getModel from './Model'
import start, { onStart } from './start'
const app = {
    _store: null,
    _constants: {},
    _onStart: [],
    onStart,
    start
} 
const config = { effects: {} } //初始值，后面会用到
const sagaMiddleware = createSagaMiddleware()
app._store = createStore(a => a, applyMiddleware(sagaMiddleware))

export const Model = getModel(app._store,config,sagaMiddleware)
export { connect }
export default app
