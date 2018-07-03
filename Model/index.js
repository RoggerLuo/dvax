import invariant from 'invariant'
import injectModel from './injectModel'

export default function(app,config,sagaMiddleware){
    config.sagaMethod = { get }  // saga中也加入get方法
    return { 
        create: injectModel(sagaMiddleware,app._store,config),
        dispatch: app._store.dispatch,
        get,
        change,
        reduce
    }
    function get(namespace){
        if(!namespace) return app._store.getState()
        return app._store.getState()[namespace]
    }
    function change(namespace,key,value){
        invariant(namespace && key,'Model change方法需要传入namespace，key')
        invariant(value !== undefined,'Model change方法需要传入value')
        app._store.dispatch({ type: `${namespace}/change`, key, value })
    }
    function reduce(namespace,reducer){
        invariant(typeof(namespace) == 'string','Model reduce方法需要传入namespace，为string')
        invariant(namespace && reducer,'Model reduce方法需要传入namespace，reducer')
        app._store.dispatch({ type: `${namespace}/std`, reducer })
    }
}
