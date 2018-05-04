const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 获取一个对象数组的某个属性值组成的字符串，如演员名单“李冰冰，张涵予，李若彤”
const getEveryItem = (arr, type) => {
    if (!arr.length) {
        return "[无此信息]";
    }
    let _arr = [];
    arr.forEach(element => {
        _arr.push(element[type]);
    });
    return _arr.join(",");
}

// 处理评分
const handleRating = rating => {
    if (rating) {
        return rating + "分";
    } else {
        return "暂无评分";
    }
}


module.exports = {
    formatTime: formatTime,
    getEveryItem: getEveryItem,
    handleRating: handleRating
}
