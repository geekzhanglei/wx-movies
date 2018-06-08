const utils = require("../../../utils/util");
const globalVars = require("../../common/globalVars");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowOk: true,
        _start: 0,
        _count: 1,
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this;
        wx.showLoading({
            title: "努力加载中..."
        });
        // 获取当前日期
        this.setData({
            _start: _this.getDate()
        });
        // 请求接口
        utils.getMovieListApi(_this._handleScheduleData, `${globalVars.httpsDomain}/node/schedule?start=${_this.data._start}&count=${_this.data._count}`);
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
    // 自定义函数
    _handleScheduleData(data) {
        let _this = this;
        // 下拉结束
        // if (_this.data._start > data.length) {
        //     _this.setData({
        //         _isEnd: true
        //     });
        // }
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
        try {
            let _data = data[0],
                list = [],
                obj = {},
                _tmp;

            this.setData({
                date: _data.time
            });
            for (let i = 0, l = _data.links.length; i < l; i++) {
                obj.link = `${globalVars.httpsDomain}${_data.links[i]}`;
                obj.cnName = _data.texts[i].split(" ")[0];
                obj.episode = _data.texts[i].split(" ")[1];
                _tmp = _data.listItem[i].status
                if (_tmp == "取消") {
                    obj.icon = {
                        status: "cancel",
                        color: "red"
                    }
                } else if (_tmp == "续订") {
                    obj.icon = {
                        status: "success",
                        color: "green"
                    }
                } else {
                    obj.icon = {
                        status: "search",
                        color: ""
                    }
                }
                Object.assign(obj, _data.listItem[i]);
                obj.img = obj.img.replace("http://files.zmzjstu.com", globalVars.httpsDomain);
                list.push(obj);
                obj = {};
            }
            this.setData({
                list: list
            });
        } catch (error) {}
        wx.hideLoading();

    },
    getDate() {
        let time = new Date();
        return time.getDate();
    },
    // 点击跳转
    gotoTvItem(event) {
        wx.navigateTo({
            url: "/pages/common/tvitem/tvitem?schedule=" + event.currentTarget.dataset.schedule
        });
    },

})
