// pages/user/content.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      text: '我要发文'
    },
    status: -1,
    menuList: [{
      status: -1,
      name: '全部'
    }, {
      status: 10,
      name: '已发布'
    }, {
      status: 1,
      name: '待审核'
    }, {
      status: 3,
      name: '未通过'
    }, {
      status: 0,
      name: '草稿'
    }],
    contentList: []
  },
  tapStatus(e) {
    const me = this
    me.setData({
      status: e.target.dataset.status
    }, () => {
      me.loadUserContentList()
    })
  },
  loadUserContentList() {
    const me = this
    const data = {
      status: me.data.status
    }
    app.request({
      url: 'content/loadUserContentList.do',
      data: data,
      success: res => {
        me.setData({
          imgReadPath: res.json.imgReadPath,
          contentList: res.json.list
        })
      }
    })
  },
  /**
   * 查看文章
   */
  tapUserContent(e) {
    const me = this
    const index = e.currentTarget.dataset.index
    const content = me.data.contentList[index]
  },
  /**
   * 删除
   */
  deleteContent(e) {
    const me = this
    const index = e.currentTarget.dataset.index
    const content = me.data.contentList[index]
    if (content.status == 0 || content.status == 3) {
      const data = {
        contentId: content.id,
        status: me.data.status
      }
      wx.showModal({
        content: '确定删除',
        cancelText: '取消',
        confirmText: '删除',
        success(res) {
          if (res.confirm) {
            app.request({
              url: 'content/deleteContent.do',
              data: data,
              success: res => {
                me.setData({
                  contentList: res.json.list
                })
              }
            })
          } else if (res.cancel) {}
        }
      })
    }
  },
  /**
   * 如是发布文章成功后跳转，则后退按钮返回到我的
   */
  toBack(){
    wx.switchTab({
      url: '/pages/user/user'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const me = this
    app.pageInit(me, {
      success: res => {
        if (getCurrentPages().length) {
          let nav = me.data.nav
          nav.isBack = true
          me.setData({
            nav: nav
          })
        }
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
    me.loadUserContentList()
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