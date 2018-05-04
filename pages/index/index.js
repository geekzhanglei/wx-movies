//index.js
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");

Page({
    data: {
        title: '热映电影',
        movieArr: [],
    },
    //事件处理函数
    // bindViewTap: function() {
    //   wx.navigateTo({
    //     url: '../logs/logs'
    //   })
    // },
    onLoad: function() {
        let _this = this;
        getHotMoviesApi(handleHotMoviesData);


        function handleHotMoviesData(data) {
            let _movieArr = [];
            data.forEach(element => {
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
            // 测试
            // _movieArr = [{
            //     id: 1232,
            //     src: 3434,
            //     title: '天赐良机',
            //     type: '卡通',
            //     director: '张三',
            //     actors: '李四',
            //     rating: 12
            // }];
            _this.setData({
                movieArr: _movieArr
            });


        }
        // handleHotMoviesData([]);

        function getHotMoviesApi(fn) {
            var _this = this;
            wx.request({
                url: 'https://api.feroad.com/v2/movie/in_theaters',
                header: {
                    'content-type': 'json' // 默认值
                },
                success: function(res) {
                    if (res.statusCode == 200) {
                        console.log(res.data.subjects);
                        fn(res.data.subjects);
                    } else {
                        console.log("获取数据失败，真的！");
                    }
                },
                fail: function(res) {
                    console.log('网络请求失败，真的！');
                }
            })
        }
    },
    // getUserInfo: function(e) {
    //     console.log(e)
    //     app.globalData.userInfo = e.detail.userInfo
    //     this.setData({
    //         userInfo: e.detail.userInfo,
    //         hasUserInfo: true
    //     })
    // },
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
    /* 点击跳转 */
    goToDetails: function(event) {
        wx.navigateTo({
            url: "/pages/common/movieitem/movieItem?id=" + event.currentTarget.id
        });
    }
})
