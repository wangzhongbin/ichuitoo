// pages/goods/goods.js

const app = getApp()

const loadPage = require('../../utils/js/load-page.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoadPage: false,
    touch: {
      y: 0,
      move: 0,
      time: 0
    },
    scroll: {
      move: 0
    },
    nav: {
      text: '好物推荐',
      loading: true
    },
    bottom: {
      text: '一不小心看完了',
      isText: true
    },
    ad: {
      top: {
        current: 0,
        list: []
      },
      middle: {
        list: []
      }
    },
    goodsList: []
  },
  loadPage() {
    this.loadGoodsInfo()
  },
  /**
   * 轮播事件
   */
  swiperChange(e) {
    const me = this;
    let ad = me.data.ad
    ad.top.current = e.detail.current
    me.setData({
      ad: ad
    })
  },
  /**
   * 加载好物信息
   */
  loadGoodsInfo() {
    const me = this
    app.request({
      url: 'goods/loadGoodsList.do',
      success: res => {
        let ad = me.data.ad
        ad.top.list = res.json.adTopList
        ad.middle.list = res.json.adMiddleList
        me.setData({
          imgReadPath: res.json.imgReadPath,
          ad: ad,
          goodsList: res.json.goodsList
        }, () => {
          if (me.data.isLoadPage) {
            loadPage.loadEnd(me)
          }
        })
      }
    });
  },
  /**
   * 广告url跳转
   */
  toAdPage(e) {
    const me = this
    const index = e.currentTarget.dataset.index
    const type = e.currentTarget.dataset.type
    let ad;
    if (type == 1) { //top的广告
      ad = me.data.ad.top.list[index]
    } else {
      ad = me.data.ad.middle.list[index]
    }
    let url = ad.url
    if (ad.urlType == 4) {
      url = '/pages/h5/h5?url=' + url
    }
    wx.navigateTo({
      url: url
    })
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
    me.loadGoodsInfo()
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
   * 滚动条监听
   */
  scroll(e) {
    loadPage.scroll(this, e)
  },
  /**
   * 下拉开始
   */
  touchStart(e) {
    loadPage.touchStart(this, e)
  },
  /**
   * 下拉移动
   */
  touchMove(e) {
    loadPage.touchMove(this, e)
  },
  /**
   * 下拉结束
   */
  touchEnd(e) {
    loadPage.touchEnd(this, e)
  }
})