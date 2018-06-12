const globalVars = require("../../common/globalVars");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,
        tv: [],
        tvId: '',
        tvType: '',
        resourceDetail: '',
        resourceLink: 'http://zmz003.com/404.html',
        _isLoadingLink: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this;

        console.log(options);

        if (options.link) {
            this.setData({
                isShow: true,
                tvType: "hot",
                tvId: options.link.split('/').reverse()[0],
                resourceDetail: options.link
            });
            // 接口请求，回调数据渲染
            this.getMovieDetailsApi(_this.renderFunc);
        } else if (options.data) {
            this.setData({
                isShow: true,
                tvType: "slider",
                tvId: options.data.split('/').reverse()[0],
                resourceDetail: options.data
            });
            // 接口请求，回调数据渲染
            this.getMovieDetailsApi(_this.renderFunc);
        } else if (options.schedule) {
            let scheduleData = JSON.parse(options.schedule);
            this.setData({
                tv: {
                    cnName: scheduleData.cnName,
                    enName: scheduleData.enName,
                    img: scheduleData.img,
                    type: scheduleData.type,
                    tv: scheduleData.tv,
                    des: scheduleData.des,
                    director: scheduleData.director,
                    cast: scheduleData.cast,
                    point: scheduleData.point,
                    readNum: scheduleData.readNum,
                    status: scheduleData.status,
                    link: scheduleData.resource,
                    screenwriter: scheduleData.screenwriter
                },
                isShow: true,
                resourceDetail: scheduleData.link
            });
        } else {}
        // 更新资源链接
        this.refreshSorLin();
    },


    /**
     * 自定义函数
     */
    refreshSorLin() {
        let _this = this;
        wx.request({
            url: `${globalVars.httpsDomain}/node/resource?id=${_this.data.resourceDetail.split('/').reverse()[0]}`,
            method: 'GET',
            header: {
                'content-type': 'text/plain' // 默认值
            },
            success: function(res) {
                _this.setData({
                    resourceLink: res.data,
                    _isLoadingLink: false
                });
            },
            fail: function(err) {
                console.log('网络错误');
            }
        })
    },
    shareLink() {
        let _this = this;
        if (this.data._isLoadingLink) {
            wx.showToast({
                icon: 'none',
                title: '正在努力搜索资源，请几秒后重试',
                duration: 2000
            });
        } else {
            wx.setClipboardData({
                data: _this.data.resourceLink,
                success: function(res) {
                    wx.showToast({
                        icon: 'none',
                        title: '复制成功，请在浏览器中打开',
                        duration: 2000
                    });
                }
            })
        }
    },
    renderFunc(data) {
        this.setData({
            tv: {
                cnName: data.cnName,
                enName: data.enName,
                img: data.img,
                type: data.type,
                season: data.season,
                tv: data.tv,
                des: data.des,
                director: data.director,
                cast: data.cast,
                point: data.point,
                readNum: data.readNum,
                status: data.status,
                link: data.resource
            },
            isShow: true
        });
        // 更新页面标题
        wx.setNavigationBarTitle({
            title: data.cnName //页面标题为路由参数
        });
    },
    // 每一页的图片
    getMovieDetailsApi(fn) {
        let _this = this;
        wx.request({
            url: globalVars.httpsDomain + '/node/tv?type=' + _this.data.tvType + "&id=" + _this.data.tvId,
            header: {
                'content-type': 'json' // 默认值
            },
            success: function(res) {
                console.log(res)
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
})
