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
        // config        
        let { baseUrl, headers, bodyTransform } = config
        if(!baseUrl) baseUrl = ''
        if(baseUrl[baseUrl.length-1] == '/') {
            url = baseUrl + url
        }else{
            url = baseUrl + '/' + url            
        }
        // apply config to options
        if (options.method === 'POST' || options.method === 'PUT') {
            if(bodyTransform){
                options.body = bodyTransform(options.body)
            }  
        }
        if (headers) {
            options.headers = { ...options.headers, ...headers }
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
            .catch(err => receiveData({ hasError:true, error: err }))
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
            queryStr += query[k]
            queryStr += '&'
        }
    }
    return queryStr.slice(0, -1)
}