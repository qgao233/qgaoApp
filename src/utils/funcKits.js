export const calcStringLen = (str) =>{
    var b = 0; 
    var l = str.length;  //初始化字节数递加变量并获取字符串参数的字符个数
    if(l) {  //如果存在字符串，则执行计划
        for(var i = 0; i < l; i ++) {  //遍历字符串，枚举每个字符
            if(str.charCodeAt(i) > 255) {  //字符编码大于255，说明是双字节字符
                b += 2;  //则累加2个
            }else {
                b ++;  //否则递加一次
            }
        }
        return b;  //返回字节数
    } else {
        return 0;  //如果参数为空，则返回0个
    }
}

export const isEmptyObject = (e) => {
    var t;  
    for (t in e)  
        return !1;  
    return !0;  
    
}

export const replaceSlash = (str) =>{
    return str.replace(new RegExp("\/", 'g'), "/"); //将所有的\/替换为/
}

export const splitVideoUrl = (str) =>{
    return str.split("$$$")[1].split("#");
}
export const splitVideoTags = (str) =>{
    return str.replace(new RegExp(",", 'g'), " ").split(" ");
}

// 改变时间显示样式
export const dateDiff = (timeStamp) => {
    //  // 补全为13位
    //  var arrTimestamp = (timestamp + '').split('');
    //  for (var start = 0; start < 13; start++) {
    //      if (!arrTimestamp[start]) {
    //          arrTimestamp[start] = '0';
    //      }
    //  }
    //  timestamp = arrTimestamp.join('') * 1;


    var now = new Date();

    var diffValue = now.getTime() - timeStamp;
    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return '不久前';
    }

    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var halfamonth = day * 15;
    var month = day * 30;
    // 计算差异时间的量级
    var monthC = diffValue / month;
    var weekC = diffValue / week;
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    var secondC = (diffValue % minute) / 1000;

    // 数值补0方法
    //  var zero = function (value) {
    //      if (value < 10) {
    //          return '0' + value;
    //      }
    //      return value;
    //  };

    // 使用
    if (weekC >= 1) {
        // 超过1周，直接显示年月日
        return dateToString(new Date(timeStamp), now.getFullYear());
    } else if (dayC >= 1) {
        return parseInt(dayC) + " 天前";
    } else if (hourC >= 1) {
        return parseInt(hourC) + " 小时前";
    } else if (minC >= 1) {
        return parseInt(minC) + " 分钟前";
    }
    return parseInt(secondC) + ' 秒前';
};

//1.不在本年以内的：yy-MM-dd
//2.在本年以内的:MM-dd hh:mm
var dateToString = function (date, nowYear, separator) {
    if (!separator) {
        separator = "-";
    }
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    var dateTime = "";
    if (nowYear - year > 0) {
        dateTime = year + separator + month + separator + day;
    } else if (nowYear == year) {
        // var perMinute = 1000 * 60;
        // var perHour = perMinute * 60;
        // var perDay = perHour * 24;
        // var msPerDay = date.getTime()%perDay;
        // var hour = parseInt( msPerDay / perHour );
        // var msPerHour = msPerDay % perHour;
        // var min = parseInt(msPerHour / perMinute);
        var hour = date.getHours();
        var min = date.getMinutes();
        dateTime = month + separator + day + " " + hour + ":" + min;
    } else {
        return null;
    }

    return dateTime;
}

//将单位为s的时间替换为00:00
export const videoTimeFormat = (timeS) => {
    let min = 60;
    let hour = min * 60;
    let remainHour = "";
    let remainMin = "";
    let remainSec = "";
    let formatTime = "";
    if (timeS / hour >= 1) {
        remainHour = timeS / hour;
        formatTime += parseInt(remainHour) + ":"
    }
    remainMin = parseInt(timeS % hour / 60).toString();
    remainSec = parseInt(timeS % hour % 60).toString();

    if(remainMin.length == 1){
        remainMin = "0"+remainMin;
    }
    if(remainSec.length == 1){
        remainSec = "0"+remainSec;
    }
    formatTime += remainMin + ":" + remainSec;
    return formatTime;
}

/**
 * json数据去重合并
 */
 export const modifyJson = (json, oldJson) => {
    if (!json && !oldJson) return;
    if (typeof json !== "object") {
        json = JSON.parse(json);
    }
    if (typeof oldJson !== "object") {
        oldJson = JSON.parse(oldJson);
    }

    var jsonData = {};
    for (var i in oldJson) {
        jsonData[i] = oldJson[i];
    }
    for (var j in json) {
        jsonData[j] = json[j];
    }

    return jsonData;
}