import invariant from 'invariant'
import injectModel from './injectModel'
import getMethods from './methods'

export default function(store,config,sagaMiddleware){
    const methods = getMethods(store)
    config.sagaMethod = { ...methods }  // saga中注入
    return { 
        ...methods,
        create: injectModel(sagaMiddleware,store,config),
    }
}
