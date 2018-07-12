const Constant = dvaStatic.Constant

dva.test('Constant', (t) => {
    t('新增Constant静态方法', () => {
        return !!Constant
    })
    t('Constant有register方法,传入kv对象', () => {
        Constant.register({
            testkey: 'testvalue',
            testkey2: 'testvalue2'
        })
        return true
    })
    t('Constant有get方法', () => {
        return !!Constant.get
    })
    t('get方法获取之前存入的值', () => {
        return Constant.get('testkey2') === 'testvalue2'
    })
    t('同一个key，register两次将会报错', () => {
        try{
            Constant.register({
                testkey: 'testvalue',
                testkey2: 'testvalue2'
            })
        }catch(err){
            return err.name == 'Invariant Violation'
        }
        return false

    })
})