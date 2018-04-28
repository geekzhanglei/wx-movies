//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        // motto: 'Hello Wsorld',
        // userInfo: {},
        // hasUserInfo: false,
        // canIUse: wx.canIUse('button.open-type.getUserInfo')
        title: '热映电影',
        movieArr: [{
            src: 'http://baidu.com',
            title: '肖申克的救赎',
            start: '2015年6月10日',
            director: '张三',
            actors: '张三，王璐，李华',
            rating: '5'
        }, ],
    },
    //事件处理函数
    // bindViewTap: function() {
    //   wx.navigateTo({
    //     url: '../logs/logs'
    //   })
    // },
    onLoad: function() {

        getHotMoviesApi(handleHotMoviesData);

        //     if (app.globalData.userInfo) {
        //         this.setData({
        //             userInfo: app.globalData.userInfo,
        //             hasUserInfo: true
        //         })
        //     } else if (this.data.canIUse) {
        //         // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //         // 所以此处加入 callback 以防止这种情况
        //         app.userInfoReadyCallback = res => {
        //             this.setData({
        //                 userInfo: res.userInfo,
        //                 hasUserInfo: true
        //             })
        //         }
        //     } else {
        //         // 在没有 open-type=getUserInfo 版本的兼容处理
        //         wx.getUserInfo({
        //             success: res => {
        //                 app.globalData.userInfo = res.userInfo
        //                 this.setData({
        //                     userInfo: res.userInfo,
        //                     hasUserInfo: true
        //                 })
        //             }
        //         })
        //     }
        function handleHotMoviesData(data) {
            let item, _this = this,_movieArr=[];
            for (item in data) {
                _movieArr.push({
                    src: item.images.medium,
                    title: '肖申克的救赎',
                    start: '2015年6月10日',
                    director: '张三',
                    actors: '张三，王璐，李华',
                    rating: '5'
                })
                this.setData({
                    movieArr[i++].rating: item.rating.average;
                });
            }
            this.setData({
                movieArr: data
            })
            console.log(this.movieArr)
        }

        function getHotMoviesApi(fn) {
            wx.request({
                url: 'https://api.feroad.com/v2/movie/in_theaters',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    console.log(res.data.subjects)
                    fn(res.data.subjects);
                },
                fail: function(res) {
                    alert('网络请求失败，真的！')
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
    }
})
