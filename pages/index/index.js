//index.js
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");

Page({
    data: {
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
        utils.getMovieListApi(_this.handleHotMoviesData, 'https://api.feroad.com/v2/movie/in_theaters?start=0&count=' + _this.data._count);
    },

    // 下拉刷新
    onReachBottom: function() {
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

        utils.getMovieListApi(_this.handleHotMoviesData, "https://api.feroad.com/v2/movie/in_theaters?start=" + _this.data._start + "&count=" + _this.data._count);
    },

    // 转发
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '影视资讯首页',
            path: '/page/user?id=123',
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
        if (_this.data._start > data.total) {
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
        _this.setData({
            movieArrSource: _this.data.movieArrSource.concat(_movieArr)
        });

    }

})
