import invariant from 'invariant'
export default function(config) {
    if(typeof(config) === 'function') {
        config = config()
    }
    return (url, options) => {
        // options
        if(!options) options = {}
        options = { ...options }
        if(!options.headers){
            options.headers = {}  
        } 
        if (!options.method) options.method = "GET"
        options.method = options.method.toUpperCase()
        options.credentials = 'include'
        // config        
        let { baseUrl, headers, requestBody } = config
        if(!baseUrl) baseUrl = ''
        if(baseUrl[baseUrl.length-1] == '/') {
            url = baseUrl + url
        }else{
            url = baseUrl + '/' + url            
        }
        // apply config to options
        if (options.method === 'POST' || options.method === 'PUT') {
            
            if(options.requestBody) {
                options.body = options.requestBody(options.body)
            }
            if(!options.requestBody && requestBody){
                options.body = requestBody(options.body)
            }  

        }else{
            invariant(!options.body,'当前http方法不应含有body，忘记写{method:post}了吧') 
        }
        if (headers) {
            options.headers = {  ...headers, ...options.headers }
        }
        // support query
        const configQuery = config.query || {}
        const optionsQuery = options.query || {}
        const finalQuery = { ...configQuery, ...optionsQuery }
        if (JSON.stringify(finalQuery) !== "{}") {
            url = url + transformQuery(finalQuery) 
        }

        return fetch(url, options)
            .then(config.checkStatus || checkStatus)
            .then(config.parseText || parseText)
            .then(config.parseJSON || parseJSON)
            .then(config.receiveData || receiveData)
            // .catch(err => {
            //     console.log(err)
            // })
            //receiveData({ hasErrors:true, error: err })
    }
}
function receiveData(res){
    return res
}
function parseJSON(text){ // if it can
    try{
        return JSON.parse(text)
    }catch(err){
        return text
    }
}
function parseText(response) {
    if(response.status >= 400) {
        return {message:response.text(),httpStatus:response.status}
    }
    return response.text()
}
function checkStatus(response) {
    return response
}
function transformQuery(query) {
    let queryStr = '?'
    for (let k in query) {
        if (query.hasOwnProperty(k)) {
            queryStr += k
            queryStr += '='
            queryStr += query[k]||''
            queryStr += '&'
        }
    }
    return queryStr.slice(0, -1)
}