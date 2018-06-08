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

    }
})
