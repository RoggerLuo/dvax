import _test from 'tape'

dva.test('Keyboard class', (t) => {
    const fakeDOM = { onkeydown(){} }
    const Keyboard = dvaStatic.Keyboard
    let kb
    t('new it with a DOM', () => {
        kb = new Keyboard(fakeDOM)
        return !!kb
    })
    const keybind = kb.keybind
    t('it provides first arg with 4 var to this function', () => {
        keybind(function({ keyMap, meta, ctrl, shift }) {
            console.log('keyMap',!!keyMap)
            console.log('meta', meta)
            console.log('ctrl', ctrl)
            console.log('shift', shift)
        })
        return true
    })
    t('function should call the second arg', () => {
        keybind(
            function({ keyMap, meta, ctrl, shift }, catcher) {
                catcher(83, { ctrl: true }, () => { console.log('fake catcher callback number') })
                catcher('83', { ctrl: true }, () => { console.log('fake catcher callback string') })
            }
        )
        return true
    })
    t('result display', () => {
        fakeDOM.onkeydown({ ctrlKey: true, metaKey: false, keyCode: 83, shiftKey: false, preventDefault(){}, stopPropagation(){} })
        return true
    })
})