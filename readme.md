#dvax
更简单的redux


## 开始使用
#### 安装  

``` bash
npm install --save dvax
```
#### 应用入口文件

```javascript
import dvax from 'dvax'
import App from './App.js'
import { render } from 'react-dom'

render(
	dvax.start(App[,options]), // 传入react应用
	document.getElementById('root')
)
```
请确保运行环境支持Generator、Promise、fetch等API,  
以及拓展运算符和Object对象上的assign、keys等方法

或者可以使用 [dvax-starter](http://wwwbaidu.com) 脚手架
## 用dvax管理组件数据
#### 1.引入Model类和connect
``` javascript
import { Model, connect } from 'dvax'

function Example({ title }){
	return <div>{title}</div>
}
```
#### 2.定义一个model
```javascript
const model = {
	namespace: 'app',
	state: { title: 'defaultTitle' } 
}
Model.create(model) // 用Model类的create方法
```
#### 3.连接组件
``` javascript 
connect('app')(Example) // 直接写namespace
```
#### 4.修改model的值
``` javascript
const changeTitle = () => {
	// 第一个参数是namespace，第二个是key，第三个是要更新的value
	Model.change('app','title',`I'm new title`)
}
```
#### 写在一起，一气呵成
一个完整、独立、可交互、数据驱动的组件

``` javascript 
import { Model, connect } from 'dvax' 

Model.create({
	namespace: 'app',
	state: { title: 'defaultTitle' }
})

export default connect('app')( props =>
	<div onClick={()=>Model.change('app','title',`I'm new title`)}>
		{props.title}
	</div>
)
```
### dvax包要改成ES5的写法，万一不支持
### connect改写
connect('app')

## 用effects处理异步
## 在effects中使用fetch
```javascript
import dvax from 'dvax'
import Fetch from 'dvax/fetch'
// 配置一个fetch实例
const fetch = Fetch({ 
	baseUrl: 'http://1.1.1.1:8008',
	headers: { ... },
	bodyParser: function(bodyData){ /*返回新的body*/ } 
})
// 初始化dva，并向saga的参数中注入fetch
dvax.start({ effects: { fetch } })
```
## onStart
## controlled input组件
## debounce
## route
## 脚手架dvax-starter
## API参考


## Model reduce\change\get

```javascript
Model.reduce(state=>{
	// doSomething with state
    return { ...state }
})
```   
```javascript
Model.change('reducerName','key','value')
```   
```javascript
Model.get('reducerName').someProp
```   
## plugins: keyboard使用示范
```javascript
import { Keyboard } from 'dva'

k = new Keyboard(document.body)
k.keybind(({keyMap,meta,ctrl},catcher)=>{
    catcher(keyMap['n'],{meta,ctrl},(e)=>this.newNote())
    catcher(keyMap['s'],{meta},(e)=>this.saveNote())
    catcher(keyMap['backSpace'],{meta,ctrl},(e)=>this.deleteNote())
})
```


## test/inject.js
注入`dva`和`dvaStatic`两个全局变量,  
使用`dva.test`来构建测试,  
示例：  

```javascript
const Xss = dvaStatic.Xss
dva.test('Xss', (t) => {
    const string = 'test<a>testatesta'
    t('translated string',()=>{
        return Xss.escape(string) === 'test&lt;a&gt;testatesta' 
    })
})
```
