// pages/user/user.js

const app = getApp()

const authScope = require('../../utils/js/auth-scope.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      text: '我的'
    },
    user: {},
    userCount: {
      issueNumber: 0,
      likeNumber: 0,
      fansNumber: 0,
      praiseNumber: 0
    },
    level: 0,
    showPraise: false,
    showTextarea: false,
    textareaInfo: ''
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
  tapScore() {
    app.toast('正在建设中...')
  },
  showPraise() {
    const me = this
    if (me.data.authScope.userInfo) {
      me.setData({
        showPraise: true
      })
    }
  },
  hideLayer: function(e) {
    var me = this;
    var close = e.target.dataset.close;
    if (close == '1') {
      me.setData({
        showPraise: false
      })
    }
  },
  signature() {
    const me = this
    me.setData({
      showTextarea: true
    })
  },
  /**
   * 获取正文
   */
  textInput(e) {
    const me = this
    let textareaInfo = e.detail.value
    textareaInfo = textareaInfo.length == 17 ? textareaInfo.substr(0, 15) : textareaInfo
    me.setData({
      textareaInfo: textareaInfo
    })
  },
  /**
   * 弹出框取消
   */
  itemTextCancel() {
    const me = this
    me.setData({
      showTextarea: false,
      textareaInfo: ''
    })
  },
  /**
   * 弹出框确认
   */
  itemTextConfirm() {
    const me = this
    const textareaInfo = me.data.textareaInfo
    if (app.isNotNull(textareaInfo)) {
      const data = {
        signature: textareaInfo
      }
      app.request({
        data: data,
        url: 'user/updateSignature.do',
        success: res => {
          let user = me.data.user
          user.signature = res.json.signature
          me.setData({
            user: user,
            showTextarea: false,
            textareaInfo: ''
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const me = this
    app.pageInit(me, {
      success: res => {
        // if (me.data.authScope.userInfo){
        //   me.loadUserInfo()
        // }
      }
    })
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
    if (me.data.authScope.userInfo) {
      me.loadUserInfo()
    }
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

  },
  /**
   * 授权回调
   */
  onGetUserInfo() {
    const me = this
    authScope.onGetUserInfo(me, {
      success: res => {
        if (me.data.authScope.userInfo) {
          me.loadUserInfo()
        }
      }
    })
  }
})