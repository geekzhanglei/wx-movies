Component({
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        // innerText: {
        //     type: String,
        //     value: 'default value',
        // }
        listSource: Array
    },
    data: {
        // 这里是一些组件内部数据,初始化时渲染用
    },
    // ready:function(){
    //   this.dataInit();
    // },
    methods: {
        /* 点击跳转 */
        goToDetails(event) {
            wx.navigateTo({
                url: "/pages/common/movieitem/movieItem?id=" + event.currentTarget.id
            });
        }
    }
})
