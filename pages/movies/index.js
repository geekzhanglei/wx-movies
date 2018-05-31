// pages/movies/index.js
const utils = require("../../utils/util");
const globalVars = require("../common/globalVars");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowOk: true,
        _start: 0,
        _count: 15,
        _isEnd: false,
        isFind: true,
        isSearchingTitle: '',
        isSearchingInput: '',
        title: '搜索',
        arrMovieList: [],
        searchKeyWords: "",
        imgOngoing: '',
        imgTop250: '',
        imgComing: '',
        imgUSBook: ''
    },
    onLoad() {
        this.init();
    },
    init() {
        let _this = this;
        utils.getListApi(_this._handleInitImg("comming"), globalVars.httpsDomain + "/v2/movie/coming_soon?start=0&count=1");
        utils.getListApi(_this._handleInitImg("top250"), globalVars.httpsDomain + "/v2/movie/top250?start=0&count=1");
        utils.getListApi(_this._handleInitImg("usBook"), globalVars.httpsDomain + "/v2/movie/us_box");
        utils.getListApi(_this._handleInitImg("ongoing"), globalVars.httpsDomain + "/v2/movie/in_theaters?start=0&count=1");

    },

    _handleInitImg(type) {
        let _this = this;
        return function(data) {
            if (data === "errorRequest") {
                wx.hideLoading();
                wx.showToast({
                    title: '请求失败，可能接口超限，请稍后重试',
                    duration: 2000,
                    icon: 'none'
                })
                return;
            }
            switch (type) {
                case "comming":
                    _this.setData({
                        imgComing: data.subjects[0].images.small,
                    });
                    break;
                case "top250":
                    _this.setData({
                        imgTop250: data.subjects[0].images.small
                    });
                    break;
                case "usBook":
                    _this.setData({
                        imgUSBook: data.subjects[0].subject.images.small
                    });
                    break;
                case "ongoing":
                    _this.setData({
                        imgOngoing: data.subjects[0].images.small,
                    });
                    break;
                default:
                    break;
            }
        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        this.setData({
            isFind: true,
            isSearchingInput: "",
            isSearchingTitle: "",
            title: '搜索',
        });
        wx.switchTab({
            url: '../movies/index'
        });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
    },
    /**
     * scroll-view页面上拉触底事件的处理函数
     */
    scrollToLower() {
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

        utils.getListApi(this._handleSearchData, globalVars.httpsDomain + "/v2/movie/search?q={" + _this.data.searchKeyWords + "}" + "&start=" + _this.data._start + "&count=" + _this.data._count);
    },

    // 点击事件
    goToList(event) {
        wx.navigateTo({
            url: "/pages/movies/find/find?id=" + event.currentTarget.id
        });
    },
    clickInput(e) {
        this.setData({
            isFind: false,
            isSearchingInput: 'searchInput',
            isSearchingTitle: 'searchTitle',
            title: '<返回'
        });
    },
    backto() {
        if (this.data.title == "<返回") {
            this.setData({
                isFind: true,
                isSearchingInput: "",
                isSearchingTitle: "",
                title: '搜索',
            });
        }
    },
    // 输入input内容搜索
    inputKeyWords(e) {
        let _this = this;
        if (!e.detail.value) {
            this.setData({
                arrMovieList: []
            });
            return;
        }
        this.setData({
            searchKeyWords: e.detail.value
        });
        this._throttle(this._getListApi, this, e.detail.value);
    },

    // 请求数据
    _getListApi(param) {
        let _this = this;
        this.setData({
            _start: 0
        });
        if (_this.data._start == 0) {
            this.setData({
                arrMovieList: []
            });
        }
        utils.getListApi(this._handleSearchData, globalVars.httpsDomain + "/v2/movie/search?q={" + param + "}" + "&start=" + _this.data._start + "&count=" + _this.data._count);
    },
    // 处理数据
    _handleSearchData(data) {
        let _this = this;
        let _movieArr = [],
            _box = "";

        // 请求失败
        if (data == "errorRequest") {
            wx.hideloading();
            wx.showToast({
                title: '请求失败,可能是接口达到上限，请十五分钟后尝试',
                duration: 2000,
                icon: 'none'
            });
            this.setData({
                isShowOk: false
            });
        }

        // 下拉列表结束
        if (_this.data._count > data.subjects.length) {
            _this.setData({
                _isEnd: true
            });
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
    // 函数防抖
    _throttle(method, context, data) {
        try {
            clearTimeout(method.id);
            method.id = setTimeout(() => {
                method.call(context, data);
            }, 1000);
        } catch (e) {}
    }
})
