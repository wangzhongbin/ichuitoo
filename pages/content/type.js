// pages/content/type.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      text: '选择文章类型',
      isIPX: false,
      isFirstPage: false,
      scrollHeight: 0
    },
    list: []
  },

  loadTypeList() {
    const me = this
    app.request({
      url: 'content/loadContentTypeList.do',
      success: res => {
        me.setData({
          list: res.json.list
        })
      }
    });
  },
  choice(e) {
    const me = this
    const list = me.data.list
    const index = e.currentTarget.dataset.index
    getCurrentPages()[getCurrentPages().length - 2].setData({
      type: list[index]
    }, () => {
      wx.navigateBack({
        delta: 1
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const me = this
    app.pageInit(me)
    me.loadTypeList()
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