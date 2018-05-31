Component({
  externalClasses:['comp'],
    properties: {
        listSource: Array,
        whichPage:String
        // isShowOk: true
    },
    methods: {
        /* 点击跳转 */
        goToDetails(event) {
            wx.navigateTo({
                url: "/pages/common/movieitem/movieItem?id=" + event.currentTarget.id
            });
        }
    }
})
