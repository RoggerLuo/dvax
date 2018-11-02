#dvax@1.0.35
更简单的redux

- [开始使用](#guide1)  
- [Tutorial: 用dvax管理组件数据](#guide2)
- [Model类](#model)
- [Effect](#effect)
* [全局提示：toast](#alert)
* [淡入淡出动画：fade](#fade)


## <span id="guide1">开始使用</span>
#### 安装  

``` bash
>npm install --save dvax
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
确保运行环境支持Generator、Promise、fetch等API,  
以及拓展运算符和Object对象上的assign、keys等方法

#### 或者使用 `dvax-starter` 脚手架

```bash
> npm install -g dvax-starter
> dvax init
```

## <span id="guide2">Tutorial: 用dvax管理组件数据</span>

#### 引入Model
```javascript
import { Model } from 'dvax'
```
#### 定义一个model
```javascript
const model = {
	namespace: 'app',
	state: { title: 'defaultTitle' } 
}
Model.create(model) // 用Model类的create方法
```
#### 连接组件
``` javascript 
function Example({ title }){
	return <div>{title}</div>
}
Model.connect('app')(Example) // connect中直接写namespace
```
#### 改变model的状态
```javascript
change('title',`I'm new title`) // 第一个参数是key，第二个是要更新的valu	
```
#### 一个完整、独立、可交互、数据驱动的组件
``` javascript
import { Model, connect } from 'dvax'
Model.create({
	namespace: 'app',
	state: { title: 'defaultTitle' }
})
function Example({ title, change }){ // change方法注入，来自connect
	const changeTitle = () => {
		change('title',`I'm new title`) 
	}
	return <div onClick={changeTitle}>{title}</div>
}
Model.connect('app')(Example)
```

#  <span id="model">Model类</span>
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
动态创建一个Model

#### Model.dispatch(action)
同redux的dispatch
#### Model.change(namespace,key,value)
改变model的state中某一个field/key的值

#### Model.reduce(namespace,function(state))
替换model的state，  
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
#### Model.run(namespace,effect) 
run方法是运行一个effect,(或者说redux-saga)

```javascript
Model.run('app',function*({fetch,get,change,reduce}}){
	// get, change, reduce用法见下面的“注入方法”
})
```

#### Model.connect(namespace/function)
可以用传统方式传入mapToState函数，也可以写成namespace的格式：

``` javascript
Model.connect('app')(App) // 把App组件连接到'app'model
```

传入namespace来连接，  
被连接的组件会拥有**注入方法**：reduce、change、run和get，    

注入方法和Model上的同名方法的使用方式相似，  
他们的区别是：注入方法省略了第一个参数(namespace)


``` javascript
function App({ change, reduce, run }){
	const onClick = () => change('key','value')
	// 或者
	// const onClick = () => Model.change('app','key','value')
	return <div onClick={onClick}>abc</div>
}
```


## <span id="effect">Effects</span>
### 在effects中使用fetch
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
// 定义
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
dispatch effects向远端拿数据会失败，因为fetch还未注入， 
可以把dispatch的语句放在onStart中

``` javascript
import dvax,{ Model } from 'dvax'
dvax.onStart(function(){
	// 在配置注入之后，可以正常的dispatch effects
	Model.dispatch({ type: 'fetchData' })
})
```
## <span id="alert">全局提示：Toast</span>

```javascript
import toast from 'dvax/toast'
toast('上传成功',2000,'good')
toast('上传失败',2000,'bad')
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

