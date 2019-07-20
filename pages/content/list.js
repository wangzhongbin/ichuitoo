// pages/content/list.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: {
      current: 0,
      size: 20
    },
    nav: {
      text: '精选好文'
    },
    bottom: {
      text: '一不小心看完了',
      isText: true
    },
    list: []
  },
  loadContentList() {
    const me = this
    app.request({
      data: me.data.page,
      url: 'content/loadContentList.do',
      success: res => {
        me.setData({
          imgReadPath: res.json.imgReadPath
        }, () => {
          me.forList(res.json.list)
        })
      }
    });
  },
  forList(list, index) {
    const me = this
    index = app.isNotNull(index) ? index : 0
    let obj = list[index]
    obj.imgReadPath = me.data.imgReadPath
    const imageList = obj.imageList
    let classType = 1
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
    const me = this;
    app.pageInit(me)
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
    const me = this
    me.loadContentList()
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