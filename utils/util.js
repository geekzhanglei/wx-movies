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

// 获取数据列表
const getMovieListApi = (callback, url) => {
    wx.request({
        url: url,
        header: {
            'content-type': 'json' // 默认值
        },
        success: function(res) {
            if (res.statusCode == 200) {
                callback(res.data);
            } else {
                console.log("获取数据失败，真的！错误码：" + res.statusCode);
            }
        },
        fail: function(res) {
            console.log('网络请求失败，真的！');
        }
    })
}

// 处理票房数据
const handleBox = function(data) {
    console.log(data)
    let res = 0;
    switch (true) {
        case data < 10000:
            res = data + "美元";
            break;
        case data >= 10000 && data < 100000000:
            res = (data / 10000).toFixed(1) + "万美元";
            break;
        case data > 100000000:
            res = (data / 10000000).toFixed(3) + "亿美元";
            break;
        default:
            res = "票房数据有误";
            break;
    }
    return res;
}

module.exports = {
    formatTime: formatTime,
    getEveryItem: getEveryItem,
    handleRating: handleRating,
    getMovieListApi: getMovieListApi,
    handleBox: handleBox
}
