import invariant from 'invariant'
import injectModel from './injectModel.js'
import getMethods from './methods.js'

export default function(store,config,sagaMiddleware){
    const methods = getMethods(store,sagaMiddleware,config)
    config.sagaMethod = { ...methods }  // saga中注入
    return { 
        ...methods,
        create: injectModel(sagaMiddleware,store,config),
    }
}
