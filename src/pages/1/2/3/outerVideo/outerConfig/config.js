import {unicode2Cn} from '../../../../../../utils/funcKits'


//列表地址
let outerLinkList = "https://api.apibdzy.com/api.php/provide/vod/?ac=list";
//详细信息地址
let outerLinkDetail = "https://api.apibdzy.com/api.php/provide/vod/?ac=detail";

export const initOuterLink = (jsonData)=>{
    const {list,detail} = jsonData;
    outerLinkList = list;
    outerLinkDetail = detail;
}

//获得视频分类
export const getVideoTypes = () => {
    return fetch(outerLinkList + "&t=1").then(handleResponse);
}
//根据视频分类，获得某个分类下的视频
// typeId = 类别ID
// page = 页码
// key = 搜索关键字
// hour = 最近几小时内的数据
export const getVideoList = (obj) => {
    let { page, typeId, key, hour } = obj;

    let request = outerLinkList;

    page = page == undefined ? 1 : page;
    request += "&pg=" + page;

    if (typeId) {
        request += "&t=" + typeId;
    }

    if (key) {
        request += "&wd=" + key;
    }

    if (hour) {
        request += "&h=" + hour;
    }

    return fetch(request).then(handleResponse);
}

//获得视频内容：ids:字符串，多个可用逗号分隔
export const getVideoDetail = (obj) => {
    let { page, typeId, ids, hour } = obj;

    let request = outerLinkDetail;

    page = !page ? 1 : page;
    request += "&pg=" + page;

    if (typeId) {
        request += "&t=" + typeId;
    }

    if (ids) {
        request += "&ids=" + ids;
    }

    if (hour) {
        request += "&h=" + hour;
    }
    return fetch(request).then(handleResponse);
}


export const handleResponse = (response) => {
    let contentType = response.headers.get('content-type')
    if (contentType.includes('application/json') || contentType.includes('text/html')) {
        return handleJSONResponse(response)
    } 
    // else if (contentType.includes('text/html')) {
    //     return handleTextResponse(response)
    // } 
    else {
        // Other response types as necessary. I haven't found a need for them yet though.
        throw new Error(`Sorry, content-type ${contentType} not supported`)
    }
}

const handleJSONResponse = (response) => {
    return response.json().then(json => {
            if (response.ok) {
                
                return JSON.parse( unicode2Cn(JSON.stringify(json)))
            } else {
                return Promise.reject(Object.assign({}, json, {
                    status: response.status,
                    statusText: response.statusText
                }))
            }
        })
}
const handleTextResponse = (response) => {
    return response.text()
        .then(text => {
            if (response.ok) {
                return unicode2Cn(text)
            } else {
                return Promise.reject({
                    status: response.status,
                    statusText: response.statusText,
                    err: text
                })
            }
        })
}