import invariant from 'invariant'

export default function(store){
    return { 
        dispatch: store.dispatch,
        get,
        change,
        reduce,
        fetch
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
}