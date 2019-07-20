// pages/user/detail.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      text: '达人详情'
    },
    bottom: {
      text: '一不小心看完了',
      isText: true
    },
    level: 0,
    user: {},
    userCount: {},
    list: []
  },
  loadUserInfo() {
    const me = this
    app.request({
      url: 'user/loadUserInfo.do',
      success: res => {
        let user = res.json.user
        if (app.isNull(user.signature))
          user.signature = '本宝宝暂时还没有写个人简介'
        me.setData({
          level: res.json.level,
          user: user,
          userCount: res.json.userCount
        })
      }
    })
  },
  loadUserOnlineList() {
    const me = this
    app.request({
      url: 'content/loadUserOnlineList.do',
      success: res => {
        me.setData({
          imgReadPath: res.json.imgReadPath,
        }, () => {
          if (res.json.list.length > 0) {
            me.forList(res.json.list)
          }
        })
      }
    })
  },
  /**
   * 内容列表处理
   */
  forList(list, index) {
    const me = this
    index = app.isNotNull(index) ? index : 0
    let obj = list[index]
    obj.imgReadPath = me.data.imgReadPath
    let classType = 1;
    const imageList = obj.imageList
    if (imageList.length == 3) {
      classType = Math.floor(Math.random() * 10) % 2 === 0 ? 1 : 2
    }
    if (classType == 1) {
      let imgIndex = app.random(0, imageList.length - 1)
      obj.image = imageList[imgIndex]
    }
    obj.classType = classType
    list[index] = obj
    index++
    if (index < list.length) {
      me.forList(list, index)
    } else {
      me.setData({
        list: list
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const me = this
    app.pageInit(me)
    me.loadUserInfo()
    me.loadUserOnlineList()
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