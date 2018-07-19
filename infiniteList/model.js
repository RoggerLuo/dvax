import toast from '../toast'
import delay from '../delay'
export default (namespace,cbs) => ({
    namespace,
    state: {
        data: [],
        hitBottom: false,
        refreshing: false,
        fetching: false,
        ref:null
    },
    effects: {
        * fetchData(placeholder,{ fetch, change, reduce, call, put, get }){
            if(get().hitBottom) return
            if(get().fetching) return
            yield change('fetching',true)
            const isEnd = yield cbs.fetchData({ fetch, change, reduce, call, put, get }) // yield另一个generator的时候，可以阻塞当前genrator运行
            yield delay(300)
            if(isEnd) yield change('hitBottom',true)
            yield change('fetching',false)
        },
        * refresh(placeholder,{ fetch, change, reduce, call, put, get }){
            yield change('hitBottom', false)
            if(get().refreshing) return
            yield change('refreshing',true)
            yield cbs.refresh({ fetch, change, reduce, call, put, get })
            yield change('refreshing',false)
            if(get().ref){
                get().ref.scrollTo({top:0})
            }
        }
    },
    reducers: {
        hitBottom(state){
            return { ...state, hitBottom: true}
        },
        setRef(state,{ element }){
            return { ...state, ref: element }
        }
    }
})
