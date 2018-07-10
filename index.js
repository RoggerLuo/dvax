import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { connect } from 'react-redux'
import getModel from './Model'
import start, { onStart } from './start'
const app = {
    _store: null,
    _constants: {},
    _onStart: [],
    _config: { effects: {} }, //初始值，后面会用到
    onStart,
    start
} 
const sagaMiddleware = createSagaMiddleware()
app._store = createStore(a => a, applyMiddleware(sagaMiddleware))

export const Model = getModel(app._store,app._config,sagaMiddleware)
export { connect }
export default app
