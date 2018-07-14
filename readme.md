#dvax
更简单的redux

- [开始使用](#guide1)  
	- 安装
	- 应用入口文件
- [用dvax管理组件数据](#guide2)
	- 1.引入model类
	- 2.定义一个model
	- 3.连接组件
	- 4.修改model的值
* [全局提示：alert](#alert)
* [淡入淡出动画：fade](#fade)


## <span id="guide1">开始使用</span>
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

## <span id="guide2">用dvax管理组件数据</span>

#### 1.引入Model类
``` javascript
import { Model } from 'dvax'

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
Model.connect('app')(Example) // 直接写namespace
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

export default Model.connect('app')( props =>
	<div onClick={()=>Model.change('app','title',`I'm new title`)}>
		{props.title}
	</div>
)
```

# Model类
#### modelConfig
``` javascript
{
	namespace: 'string', // 唯一必填
	state: 'object', //初始值， 
	effects: { 
		'generator' 
	},
	reducers: { 
		'function'
	}
}
```
#### Model.create(modelConfig)
根据config创建一个Model，加入到dvax中，  
可以动态创建
#### Model.dispatch(action)
同redux的dispatch
#### Model.change(namespace,key,value)
改变model的state中某一个field/key的值

#### Model.reduce(namespace,function(state))
对model的state进行更迭，  
函数的返回值将作为新的state

```javascript
Model.reduce(namespace,state=>{
	// doSomething with state
    return { ...state }
})
```   
#### Model.get(namespace)
实时获取state最新的值  

```javascript
Model.get() // 获取所有state
Model.get('namespace') // 获取某个特定的model的state
Model.get().app === Model.get('app') // true
```   
#### Model.connect(namespace/function)
可以直接写namespace('modelName'),  
也可以用传统方式传入mapToState函数

## 在effects中使用fetch
配置fetch

```javascript
import dvax from 'dvax'
import Fetch from 'dvax/fetch'
const fetch = Fetch({ // 配置一个fetch实例
	baseUrl: 'http://1.1.1.1:8008',
	headers: { ... },
	bodyTransform(body){ 
		return body
	} 
})
dvax.start(App,{ effects: { fetch } }) // 初始化dvax，并向saga的参数中注入fetch
```

在model中，

``` javascript
{
	namespace:'example',
	effects:{
		*fetchData(params,{ fetch, call, dispatch }){
			const res = yield call(fetch,'data')
			yield dispatch({ type:'someAction', res })
		}
	}
}
// 使用
Model.dispatch({ type:'fetchDate' })
```

## onStart
如果在dvax.start之前，  
dispatch effects向远端拿数据，会失败，  
因为fetch还未注入， 
可以把dispatch的语句放在onStart中

``` javascript
import dvax,{ Model } from 'dvax'
dvax.onStart(function(){
	// 在配置注入之后，可以正常的dispatch effects
	Model.dispatch({ type: 'fetchData' })
})
```
## Controlled input: inputController组件
帮input自动绑定model，  
暴露出一个拦截器函数，可以干涉输入过程，做一些校验和监听，  
视图input组件接受onChange和value两个props

``` javascript
import inputController from 'dvax/inputController'
const MyInput = ({onChange,value}) => {
	return <input type="text" onChange={onChange} value={value} />
}
const ControllerdInput = inputController(
	MyInput,
	'name of model',
	'field or key',
	(newVal,oldVal)=>{
		// do something when input change
	}
)
// 使用
<ControllerdInput />
```
## <span id="alert">全局提示：alert</span>
先把`Alert标签`放在全局任何一个地方

```javascript
import Alert from 'dvax/alert'
<Alert/>
```
然后引用小写alert(记得加大括号)使用

```javascript
import { alert } from 'dvax/alert'
alert('上传成功',2000,'good')
alert('上传失败',2000,'bad')
```

## <span id="fade">淡入淡出动画：fade</span>
``` javascript
import Fade from 'dvax/fade'

<Fade 
	duration={seconds} 
	show={boolean} 
	style={{display:'inline-block'}} 
	className="yourClassName"
	marginTop={"5px"} // 动画出现时离自然文档流位置的距离
>
    <div>abc</div>
</Fade>

```

## Keyboard
```javascript
import Keyboard from 'dvax/keyboard'

const k = new Keyboard(document.body)
k.keybind(({keyMap,meta,ctrl},catcher)=>{
    catcher(keyMap['n'],{meta,ctrl},e=>create())
    catcher(keyMap['s'],{meta},e=>save())
    catcher(keyMap['backSpace'],{meta,ctrl},e=>del())
})
```


## 单元测试工具：test

``` javascript
test( 'title', t=>{
	t('subTitle', ()=>{
		return 'boolean'
	})
})
```

example：

```javascript
import test from 'dvax/text'
import xss from 'dvax/xss'
test('Xss', (t) => {
    const string = 'test<a>testatesta'
    t('translated string',()=>{
        return xss.escape(string) === 'test&lt;a&gt;testatesta' 
    })
})
```

## debounce
## route
## 脚手架dvax-starter
