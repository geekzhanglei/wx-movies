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
            that = this,
            _type;
        wx.showLoading({
            title: "努力加载中..."
        });
        try {
            _type = options.id;
        } catch (e) {}
        switch (_type) {
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
                wx.hideLoading();
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                break;
        }
        // 全局变量赋值
        this.setData({
            optionId: _type || "nothing"
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading();
        this.onLoad();
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
                wx.hideLoading();
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
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

        // 请求失败
        if (data == "errorRequest") {
            wx.hideLoading();
            wx.showToast({
                title: '请求失败，可能接口超限，请稍后重试',
                duration: 2000
            })
        }
        // 列表已下拉完
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
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        _this.setData({
            arrMovieList: _this.data.arrMovieList.concat(_movieArr)
        });
    },

})
