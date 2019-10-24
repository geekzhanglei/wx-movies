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
        list: [],
        date: '',
        days: [],
        isShowSelect: false,
        value: [],
        whichDay: '',
        timer: ''
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
            _start: _this.getDate() - 1,
            whichDay: "(今天)"
        });
        // 请求接口
        utils.getListApi(_this._handleScheduleData, `${globalVars.httpsDomain}/node/schedule?start=${_this.data._start}&count=${_this.data._count}`);
        // 计算当月天数

        this.initDays();
    },
    // 转发
    onShareAppMessage: function(res) {
        return {
            title: '美剧排期表',
            path: 'pages/teleplay/schedule/index'
        }
    },
    // 自定义函数
    _handleScheduleData(data) {
        let _this = this;

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
                date: _data.time,
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
                        status: "waiting",
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
        let _this = this;
      console.log(JSON.stringify(_this.data.list[event.currentTarget.dataset.schedule]))
        wx.navigateTo({
          url: "/pages/common/tvitem/tvitem?schedule=" + encodeURIComponent(JSON.stringify(_this.data.list[event.currentTarget.dataset.schedule]))
        });
    },
    initDays() {
        let time = new Date();
        let daysNum = utils.days(time.getFullYear(), time.getMonth() + 1);
        let _days = new Array(daysNum).fill("").map((ele, index) => index);
        this.setData({
            days: _days,
            value: [time.getDate() - 1]
        });
    },
    changeSchedule() {
        this.setData({
            isShowSelect: !this.data.isShowSelect
        });
    },
    bindChange(e) {
        let _this = this,
            value, _whichDay, _timeId;
        value = Number(e.detail.value[0]) - Number(this.getDate()) + 1;
        switch (value) {
            case 0:
                _whichDay = "(今天)"
                break;
            case -1:
                _whichDay = "(昨天)"
                break;
            case -2:
                _whichDay = "(前天)"
                break;
            case 1:
                _whichDay = "(明天)"
                break;
            case 2:
                _whichDay = "(后天)"
                break;
            default:
                _whichDay = "";
                break;
        }

        clearTimeout(this.data.timeId);
        _timeId = setTimeout(() => {
            utils.getListApi(_this._handleScheduleData, `${globalVars.httpsDomain}/node/schedule?start=${e.detail.value[0]}&count=${_this.data._count}`);

            this.setData({
                whichDay: _whichDay,
                isShowSelect: false,
                value: [e.detail.value]
            });
            console.log('一秒空闲后进入')
        }, 1000);
        this.setData({
            timeId: _timeId
        });

    }
});
