import test from 'dvax/test'
import mutate from './index'
const state = {
    data: [
        { value: false }
    ]
}
const complexState = {
    first: [ state, { second: false } ]
}
test('mutate',(t)=>{
    t('mutate可以接with',()=>{
        return !!mutate(state).with
    })
    t('with后面还能接with',()=>{
        return !!mutate(state).with('data[0].value',true).with
    })
    t('测试基础使用',()=>{
        const newState = mutate(state).with('data[0].value',true).done()
        return newState.data[0].value === true
    })
    t('新state不等于旧state',()=>{
        const newState = mutate(state).with('data[0].value',true).done()
        return state !== newState
    })
    t('.运算符和[]混合使用在对象上',()=>{
        const newState = mutate(state).with('data[0]["value"]',true).done()
        return newState.data[0].value === true
    })

    t('复杂情况',()=>{
        const newState = mutate(complexState)
            .with('first[1].second','abc')
            .with('first[1].second','efg')
            .done()
        return newState.first[1].second === 'efg'
    })
    t('链式使用,后面的with使用前面with的结果',()=>{
        const newState = mutate(complexState)
            .with('first[1]',state)
            .with('first[1].data[0].value',true)
            .done()
        return newState.first[1].data[0].value === true
    })

    t('函数，操作',()=>{
        const newState = mutate(complexState)
            .with('first[1]',state)
            .with('first[1].data[0].value',val=>!val)
            .done()
        return newState.first[1].data[0].value === true
    })

    t('函数，复杂操作',()=>{
        const newState = mutate(complexState)
            .with('first[1]',state)
            .with('first[1].data[0].value',val=>{return JSON.stringify(val) + 'abc'})
            .done()
        return newState.first[1].data[0].value === 'falseabc'
    })
    // 不修改原始值
    t('对象,第二个参数，不会修改原始数据',()=>{
        const newState = mutate(complexState)
            .with('first[1]',state)
            .with('first[1].data[0].value',true)
            .done()
        return state.data[0].value ===  false
    })

    t('函数,第二个参数，不会修改原始数据',()=>{
        const newState = mutate(complexState)
            .with('first[1]',state)
            .with('first[1]',val => { val.data[0].value = true })
            .done()
        return state.data[0].value === false
    })

})
