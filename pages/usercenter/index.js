// pages/usercenter/index.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        list: [{
            type: 'aboutus',
            icon: '../../images/userIcons/aboutus.png',
            title: '作者絮言'
        }, {
            type: 'connect',
            icon: '../../images/userIcons/connect.png',
            title: '联系我'
        }]
    },
    onLoad: function(options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    // 页面跳转
    goToItem(param) {
        let type = param.currentTarget.dataset.type
        if (type == 'aboutus') {
            wx.navigateTo({
                url: `/pages/usercenter/${type}/index`
            });
        }
    },
    // 点击用户头像跳转
    bindViewTap: () => {
        console.log('点击头像');
    }
})
