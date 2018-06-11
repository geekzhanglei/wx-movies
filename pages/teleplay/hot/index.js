const utils = require("../../../utils/util");
const globalVars = require("../../common/globalVars");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        rowArr: [],
        items: [1, 2, 3],
        _start: 0,
        _count: 15,
        _isEnd: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this;
        wx.showLoading({
            title: "努力加载中..."
        });
        utils.getListApi(_this._handleHotTvData, globalVars.httpsDomain + '/node/hottv?start=0&count=' + _this.data._count);
        // utils.getListApi(_this._handleHotTvData, 'http://127.0.0.1:8080/node/hottv?start=0&count=' + _this.data._count);
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
    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        this.onLoad();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        this.onLoad();
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

        utils.getListApi(_this._handleHotTvData, globalVars.httpsDomain + "/node/hottv?start=" + _this.data._start + "&count=" + _this.data._count);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    /**
     * 自定义函数
     */
    gotoDetail(event) {
        wx.navigateTo({
            url: "/pages/common/tvitem/tvitem?link=" + event.currentTarget.dataset.link
        });
    },
    _handleHotTvData(data) {
        let _this = this;
        let _tvArr = [];
        let _rowNum = 1;

        // 下拉结束
        if (_this.data._start > data.length) {
            _this.setData({
                _isEnd: true
            });
        }
        if (data == "errorRequest") {
            wx.hideLoading();
            wx.hideNavigationBarLoading();
            wx.showToast({
                icon: 'none',
                title: '接口错误，请联系管理员',
                duration: 2000
            });
            return;
        }

        _rowNum = Math.ceil(_this.data._count / 3);
        for (let i = 0; i < _rowNum; i++) {
            _tvArr[i] = new Array();
        }
        console.log(data)
        try {
            data.forEach(element => {
                element.img = element.img.replace("http://files.zmzjstu.com", globalVars.httpsDomain);
                element.link = element.link.replace("http://www.zimuzu.tv", globalVars.httpsDomain);
            });
        } catch (e) {}
        data.forEach((element, index) => {
            _tvArr[Math.floor(index / 3)].push(element)
        });

        _this.setData({
            rowArr: _this.data.rowArr.concat(_tvArr)
        });
        console.log(this.data.rowArr)
        wx.hideLoading();
        wx.hideNavigationBarLoading();

    },
})
