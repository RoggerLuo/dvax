const xssReplace = function(str) {
    const filterStrs = {
        '<': '&lt;',
        '>': '&gt;'
    }
    for (var key in filterStrs) {
        str = str.replace(new RegExp(key, 'g'), filterStrs[key]);
    }
    return str;
};

const xss = function(params) {
    if (params && typeof params === 'object') {
        params = { ...params }
        for (var i in params) {
            params[i] = (typeof params[i] === 'string') ? xssReplace(params[i]) : xss(params[i]);
        }
    } else if (typeof params === 'string') {
        params = xssReplace(params);
    }
    return params;
};



const antiXssReplace = function(str) {
    const antiXssFilterStrs = {
        '&lt;': '<',
        '&gt;': '>'
    }
    for (var key in antiXssFilterStrs) {
        str = str.replace(new RegExp(key, 'g'), antiXssFilterStrs[key]);
    }
    return str;
};

const unxss = function(params) {
    if (params && typeof params === 'object') {
        params = { ...params }
        for (var i in params) {
            params[i] = (typeof params[i] === 'string') ? antiXssReplace(params[i]) : unxss(params[i]);
        }
    } else if (typeof params === 'string') {
        params = antiXssReplace(params);
    }
    return params;
};


const Xss = {
    escape: function(str) {
        return xss(str)
    },
    unescape: function(str) {
        return unxss(str)
    }
}
export default Xss
