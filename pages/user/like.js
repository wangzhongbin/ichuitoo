// pages/user/like.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      text: '关注'
    },
    bottom: {
      text: '一不小心看完了',
      isText: true
    },
    userData: {}
  },
  loadLikeList() {
    const me = this
    app.request({
      url: 'user/loadLikeList.do',
      success: res => {
        me.setData({
          userData: {
            list: res.json.list
          }
        })
      }
    })
  },
  /**
   * 关注达人
   */
  addLike(e) {
    const me = this
    const index = e.currentTarget.dataset.index
    let userData = me.data.userData
    const data = {
      likeUserId: userData.list[index].id
    }
    app.request({
      url: 'userFans/addLike.do',
      data: data,
      success: res => {
        userData.list[index].fans = true
        me.setData({
          userData: userData
        }, () => {
          app.toast('关注成功')
        })
      }
    })
  },
  /**
   * 取消关注
   */
  cancelLike(e) {
    const me = this
    const index = e.currentTarget.dataset.index
    let userData = me.data.userData
    const data = {
      likeUserId: userData.list[index].id
    }
    app.request({
      url: 'userFans/cancelLike.do',
      data: data,
      success: res => {
        userData.list[index].fans = false
        me.setData({
          userData: userData
        }, () => {
          app.toast('取消关注')
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const me = this
    app.pageInit(me)
    me.loadLikeList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})