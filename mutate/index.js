function mutate(state){
    return { with: _with, done }
    function done(){
        return state // 返回state
    }
    function _with(...params){
        if(params.length !== 2){
            alert('参数错误，with只接受两个参数')
        }
        let path = params[0]
        const stack = splitVar(path)

        let value 
        if(typeof(params[1]) === 'function') {
            const func = params[1]
            let temp = state
            stack.forEach(stru=>{
                temp = temp[stru.name]
            })
            if(temp !== undefined) { // 克隆，为了不修改原始值
                temp = JSON.parse(JSON.stringify(temp))                                
            }
            value = func(temp)
        }else{
            value = params[1]            
        }

        state = cloneAssign(value) // 修改state
        return { with: _with, done }

        function cloneAssign(value){
            const structure = stack.pop() // [data]
            
            let temp = state  // 从state拿上一级结构的变量
            stack.forEach(stru=>{
                temp = temp[stru.name]
            })

            if(!temp) { // 如果没有temp，说明可能是path写错了
                throw Error(`找不到对应的属性，数据路径可能存在问题: "${path}" \n\n 被修改的state为{${Object.keys(state).join(',')}} \n`)
            }

            // 克隆上一级结构的变量
            if(temp.slice && typeof(temp.slice) === 'function') { //如果有slice方法,则是数组
                temp = [...temp]
            }else{
                if(typeof(temp) === 'object') {
                    temp = {...temp}
                }                
            }
            // 对克隆后的值 赋值
            temp[structure.name] = value 

            // 迭代自己或者返回
            if(stack.length !== 0){
                return cloneAssign(temp)                
            }else {
                return temp
            }
        }
        return { with: _with }
    }
}
// 判断第一个结构
function splitVar(path){
    path = path.replace(/"|'/g,'')
    const index = path.length - 1
    const returnValue = []
    splitOne(path,returnValue)
    function splitOne(path,returnValue){
        Object.values(path).some((char,ind)=>{
            if(char === '.') {
                returnValue.push({ name: path.slice(0,ind), type: 'key'}) 
                splitOne(path.slice(ind+1,path.length),returnValue)

                return true
            }
            if(char === '[') {
                returnValue.push({ name: path.slice(0,ind), type: 'array'}) 
                splitOne(path.slice(ind+1,path.length),returnValue)
                return true
            }
            if(char === ']') {
                returnValue.push({ name: path.slice(0,ind), type: 'key'}) 
                splitOne(path.slice(ind+1,path.length),returnValue)
                return true
            }
            if(ind === path.length - 1){
                returnValue.push({ name: path, type: 'key' })
                return true
            }
        })
    }
    return returnValue.filter(el=>el.name!=="") // [{ name, type },]
}

export default mutate
