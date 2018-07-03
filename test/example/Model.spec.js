const Model = dvaStatic.Model

dva.test('Model', (t) => {
    t('新增Model静态方法', () => {
        return !!Model
    })
    t('Model有create方法,传入model标准结构的对象', () => {
       Model.create({
            namespace: 'test',
            state: { 'testkey': 'init' },
            reducers: {}
        })
        return true
    })
    t('Model有get方法', () => {
        return !!Model.get
    })
    t('get方法传入namespace', () => {
        return Model.get('test').testkey === 'init'
    })
})

dva.test('新建model自动注入std和change这两个reducers', (t) => {
    t('Change方法', () => {
        Model.change('test','testkey', 'testvalue')
        return Model.get('test').testkey === 'testvalue'
    })

    t('Reduce方法', () => {
        Model.reduce('test', state => ({ ...state, testkey: 'testvalue Reduced' }))
        return Model.get('test').testkey === 'testvalue Reduced'
    })
})

dva.test('保留关键字,model不能出现std和change，不然报错', (t) => {
    t('model不能出现change，不然报错', () => {
        try {
            Model.create({
                namespace: 'test2',
                state: { 'testkey': 'init' },
                reducers: {
                    change() {

                    }
                }
            })
        } catch (err) {
            return err.name == 'Invariant Violation'
        }
        return false
    })

    t('model不能出现change，不然报错', () => {
        try {
            Model.create({
                namespace: 'test2',
                state: { 'testkey': 'init' },
                reducers: {
                    std() {

                    }
                }
            })
        } catch (err) {
            return err.name == 'Invariant Violation'
        }
        return false
    })
})