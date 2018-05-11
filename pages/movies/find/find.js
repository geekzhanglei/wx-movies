// pages/movies/find/find.js
const utils = require("../../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        arrMovieList: [],
        _optionId: "",
        _start: 0,
        _count: 15 // 多层次请求每次请求个数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this,
            that = this;
        wx.showLoading({
            title: "努力加载中..."
        });
        switch (options.id) {
            case "comming":
                wx.setNavigationBarTitle({
                    title: "电影->即将上映" //页面标题为路由参数
                });
                utils.getMovieListApi(_this.handleMovieList, "https://api.feroad.com/v2/movie/coming_soon?start=0&count=" + _this.data._count);
                break;
            case "top250":
                wx.setNavigationBarTitle({
                    title: "电影->影史top250" //页面标题为路由参数
                });
                utils.getMovieListApi(_this.handleMovieList, "https://api.feroad.com/v2/movie/top250?start=0&count=" + _this.data._count);
                break;
            case "usbox":
                wx.setNavigationBarTitle({
                    title: "电影->北美票房榜" //页面标题为路由参数
                });
                utils.getMovieListApi(_this.handleMovieList, "https://api.feroad.com/v2/movie/us_box");
                break;
            case "ongoing":
                wx.setNavigationBarTitle({
                    title: "电影->正在热映" //页面标题为路由参数
                });
                utils.getMovieListApi(_this.handleMovieList, "https://api.feroad.com/v2/movie/in_theaters");
                break;
            default:
                wx.navigateTo({
                    url: '/pages/movies/index',
                })
                break;
        }
        // 全局变量赋值
        this.setData({
            optionId: options.id
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        console.log('下拉测试');
        wx.navigateTo({
            url: '/pages/movies/index',
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
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
        switch (_this.data.optionId) {
            case "comming":
                utils.getMovieListApi(_this.handleMovieList, "https://api.feroad.com/v2/movie/coming_soon?start=" + _this.data._start + "&count=" + _this.data._count);
                break;
            case "top250":
                utils.getMovieListApi(_this.handleMovieList, "https://api.feroad.com/v2/movie/top250?start=" + _this.data._start + "&count=" + _this.data._count);
                break;
            case "ongoing":
                utils.getMovieListApi(_this.handleMovieList, "https://api.feroad.com/v2/movie/in_theaters?start=" + _this.data._start + "&count=" + _this.data._count);
                break;
            default:
                break;
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },


    // 生成电影列表数组
    handleMovieList: function(data) {
        let _this = this;
        let _movieArr = [],
            _tempArr,
            _box = "";
        if (_this.data._start > data.total) {
            _this.setData({
                _isEnd: true
            });
            return;
        }

        data.subjects.forEach(element => {
            if (element.subject) {
                element.subject.box = element.box;
                element = element.subject;
                _box = utils.handleBox(element.box);
            }
            _movieArr.push({
                id: element.id,
                src: element.images.small,
                title: element.title,
                type: element.genres,
                director: utils.getEveryItem(element.directors, 'name'),
                actors: utils.getEveryItem(element.casts, 'name'),
                rating: utils.handleRating(element.rating.average),
                box: _box
            });
        });
        wx.hideLoading();
        _this.setData({
            arrMovieList: _this.data.arrMovieList.concat(_movieArr)
        });
    },

})
