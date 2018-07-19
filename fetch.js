import invariant from 'invariant'
export default function(config) {
    return (url, options) => {
        if(!options) options = {}
        options = { ...options }

        if(typeof(config) == 'function') {
            config = config()
        }
        
        let { baseUrl, headers, bodyTransform } = config

        if(!baseUrl) baseUrl = ''
        // initial
        options.headers = {}
        options.credentials = 'include'

        // url things
        if(baseUrl[baseUrl.length-1] == '/') {
            url = baseUrl + url
        }else{
            url = baseUrl + '/' + url            
        }

        // method things
        if (!options.method) options.method = "GET"
        options.method = options.method.toUpperCase()
        if (options.method === 'POST' || options.method === 'PUT') {
            if(bodyTransform){
                options.body = bodyTransform(options.body)
            }  
        }
        if (options.query) {
            url = url + transformQuery(options.query)
        }
        if (headers) {
            options.headers = { ...options.headers, ...headers }
        }
        return fetch(url, options)
            .then(checkStatus)
            .then(parseText)
            .then(parseJSON)
            .catch(err => {
                return err.message   
            })
    }
}
function parseJSON(text){ // if it can
    try{
        return JSON.parse(text)
    }catch(err){
        console.log('尝试进行JSON.parse失败:',err.message,'返回原始值')
        return text
    }
}
function parseText(response) {
    return response.text()
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    }else{
        return { 
            text(){
                return { error: true, type: response.status, message: response.statusText }
            }
        }
    }
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
