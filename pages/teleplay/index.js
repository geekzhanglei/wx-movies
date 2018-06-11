// pages/teleplay/index.js
const utils = require("../../utils/util");
const globalVars = require("../common/globalVars");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        _count: 4
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this;
        wx.showLoading({
            title: "努力加载中..."
        });
        utils.getListApi(_this._handleSliderData, globalVars.httpsDomain + '/node/slider?start=0&count=' + _this.data._count);
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    /**
     * 自定义函数
     */
    _handleSliderData(data) {
        wx.hideLoading();
        let arrImg = [];
        console.log(data)
        try {
            data.forEach(element => {
                element.img = element.img.replace("http://files.zmzjstu.com", globalVars.httpsDomain);
                element.link = element.link.replace("http://www.zimuzu.tv", globalVars.httpsDomain);
            });
        } catch (e) {}
        this.setData({
            imgUrls: data
        });
    },

    goToHotTvList(event) {
        let _path;
        // console.log(event.currentTarget.dataset.source);
        switch (event.currentTarget.id) {
            case "hottv":
                _path = '/pages/teleplay/hot/index';
                break;
            case "schedule":
                _path = '/pages/teleplay/schedule/index';
                break;
            case "slider":
                _path = '/pages/common/tvitem/tvitem?data=' + event.currentTarget.dataset.source;
                break;
            default:
                _path = '/pages/teleplay/hot/index';
                break;;
        }

        wx.navigateTo({
            url: _path
        });
    }
})
