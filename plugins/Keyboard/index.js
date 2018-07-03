import { keyMap, meta, ctrl, shift } from './config'
import eventCatcher from './eventCatcher'
import invariant from 'invariant'

class Keyboard {
    constructor(dom) {
        this.keybind = this.keybind.bind(this)
        this._onkeydown = this._onkeydown.bind(this)
        invariant(!!dom,'keyboard要绑定的dom元素不存在')
        dom.onkeydown = (e) => {
            this._onkeydown(e)
            e.stopPropagation()
        }
        this.bindings = []
    }
    keybind(cb) {
        const fakeCatcher = (keyCode, modifierKey, callback) => {
            keyCode = parseInt(keyCode)
            invariant(typeof(keyCode) == "number", 'arg 1 should be a number')
            invariant(typeof(modifierKey) == 'object', 'arg 2 should be a object')
            invariant(typeof(callback) == 'function', 'arg 3 should be a function')
            this.bindings.push({ keyCode, modifierKey, callback })
        }
        invariant(typeof(cb) == 'function', 'keybind should be a function')
        cb({ keyMap, meta, ctrl, shift }, fakeCatcher)
    }
    _onkeydown(event) {
        const catcher = eventCatcher(event) // catcher接受一个event来生成事件捕捉器, 每次需要更新catcher
        this.bindings.forEach(({ keyCode, modifierKey, callback }) => {
            catcher(keyCode,modifierKey,callback)
        })
    }
}
export default Keyboard
