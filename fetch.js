import invariant from 'invariant'
export default function(config) {
    return (url, options) => {
        if(!options) options = {}
        options = { ...options }

        if(typeof(config) == 'function') {
            config = config()
        }
        
        const { baseUrl, headers, bodyParser } = config

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
            if(bodyParser){
                options.body = bodyParser(options.body)
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
            .then(parseJSON)
            .catch(err => err.message)
    }
}

function parseJSON(response) {
    return response.json()
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    }else{
        throw Error(response.status+','+response.statusText)
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
