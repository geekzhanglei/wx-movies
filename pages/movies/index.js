// pages/movies/index.js
const utils = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyWords: "",
        _start: 0,
        _count: 15,
        _isEnd: false
        // movieArrSource: [],
        // isList: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },


    // 点击事件
    goToList: function(event) {
        wx.navigateTo({
            url: "/pages/movies/find/find?id=" + event.currentTarget.id
        });
    },

    // input处理函数
    inputKeyWords(e) {
        let _this = this;
        if (!e.detail.value) {
            return;
        }
        this._throttle(function() {
            // utils.getMovieListApi(_this._handleSearchData, "https://api.feroad.com/v2/movie/search?q={" + e.detail.value + "}")
        });

    },
    _handleSearchData(data) {
        let _this = this;
        let _movieArr = [],
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
    _throttle(method, context) {
        clearTimeout(method.id);
        method.id = setTimeout(() => {
            method.call(context);
        }, 200);
    }
})
