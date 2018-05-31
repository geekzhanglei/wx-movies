// pages/common/movieItem.js
const utils = require("../../../utils/util.js");
const globalVars = require("../../common/globalVars");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        movie: {},
        isShow: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this;
        getMovieDetailsApi(renderFunc);
        // 数据赋值给view层
        function renderFunc(data) {
            _this.setData({
                movie: {
                    rating: data.rating.average,
                    title: data.title,
                    year: data.year,
                    director: utils.getEveryItem(data.directors, "name"),
                    casts: utils.getEveryItem(data.casts, "name"),
                    image: data.images.large,
                    summary: data.summary,
                },
                isShow: true
            });
            // 更新页面标题
            wx.setNavigationBarTitle({
                title: data.title //页面标题为路由参数
            });
        }
        // 获取电影详情接口
        function getMovieDetailsApi(fn) {
            wx.request({
                url: globalVars.httpsDomain + '/v2/movie/subject/' + options.id,
                header: {
                    'content-type': 'json' // 默认值
                },
                success: function(res) {
                    if (res.statusCode == 200) {
                        _this.setData({
                            isShow: true
                        });
                        fn(res.data);
                    } else {
                        console.log("返回状态码不是200")
                        _this.setData({
                            isShow: false
                        });
                    }
                },
                fail: function(res) {
                    console.log('网络请求失败，真的！');
                }
            })
        }
    },
    // 转发
    onShareAppMessage: function(res) {
        return {
            title: this.data.movie.title || '未知电影名',
            path: 'pages/index/index'
        }
    }
})
