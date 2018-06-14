//index.js
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");
const globalVars = require("../common/globalVars");

Page({
    data: {
        isShowOk: true,
        title: '热映电影',
        movieArrSource: [],
        _isEnd: false,
        _start: 0,
        _count: 15
    },

    // 初始加载
    onLoad: function() {
        let _this = this;
        wx.showLoading({
            title: "努力加载中..."
        });
        utils.getListApi(_this.handleHotMoviesData, globalVars.httpsDomain + '/v2/movie/in_theaters?start=0&count=' + _this.data._count);
    },
    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        this.onLoad();
    },
    // scroll-view下拉刷新
    scrolltolower() {
        let _this = this;
        // 已没有数据
        if (_this.data._isEnd) {
            return;
        }
        wx.showLoading({
            title: "加载中..."
        });
        _this.setData({
            _start: _this.data._start + _this.data._count
        })

        utils.getListApi(_this.handleHotMoviesData, globalVars.httpsDomain + "/v2/movie/in_theaters?start=" + _this.data._start + "&count=" + _this.data._count);
    },

    // 转发
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '影视资讯首页',
            path: 'pages/index/index',
            success: function(res) {
                // 转发成功
                console.log('转发成功');
            },
            fail: function(res) {
                // 转发失败
                console.log('转发失败');
            }
        }
    },

    // 自定义函数
    handleHotMoviesData: function(data) {
        let _movieArr = [],
            _this = this;
        // 请求失败
        if (data == "errorRequest") {
            wx.showToast({
                title: '请求失败，可能达到接口上限',
                icon: 'none',
                duration: 2000
            });
            this.setData({
                isShowOk: false
            });
        }
        // 下拉结束
        if (_this.data._count > data.subjects.length) {
            _this.setData({
                _isEnd: true
            });
        }
        data.subjects.forEach(element => {
            _movieArr.push({
                id: element.id,
                src: element.images.small,
                title: element.title,
                type: element.genres,
                director: utils.getEveryItem(element.directors, 'name'),
                actors: utils.getEveryItem(element.casts, 'name'),
                rating: utils.handleRating(element.rating.average)
            });
        });
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        _this.setData({
            movieArrSource: _this.data.movieArrSource.concat(_movieArr)
        });

    }

})
