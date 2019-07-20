// pages/goods/detail.js

const app = getApp()

const bottom = require('../../utils/js/bottom.js')
const authScope = require('../../utils/js/auth-scope.js')
const share = require('../../utils/js/share.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topImageUrl: '',
    goodsId: '',
    nav: {
      text: '好物详情',
    },
    entityType: 2, //评论、收藏、点赞时需要使用的类型
    imgReadPath: '',
    goods: {
      swiper: {
        current: 0,
        list: []
      }
    },
    comment: {
      number: 0,
      list: []
    },
    bottomToolbar: {
      isFocus: false,
      commentInfo: '',
      isCollect: false,
      isPraise: false,
      praiseNumber: 0
    }
  },
  swiperChange(e) {
    const me = this;
    let goods = me.data.goods
    goods.swiper.current = e.detail.current
    me.setData({
      goods: goods
    })
  },
  loadGoods() {
    const me = this
    const data = {
      goodsId: me.data.goodsId
    }
    app.request({
      url: 'goods/loadGoods.do',
      data: data,
      success: res => {
        let goods = res.json.goods
        let comment = me.data.comment
        comment.number = goods.commentNumber
        comment.list = res.json.commentList
        let bottomToolbar = me.data.bottomToolbar
        bottomToolbar.praiseNumber = goods.praiseNumber
        bottomToolbar.isPraise = res.json.isPraise
        const goodsItemList = goods.goodsItemList
        const topItem = goodsItemList.find(obj => (obj.type == 1))
        let topImageUrl = topItem.image.imgUrl
        me.setData({
          topImageUrl: topImageUrl,
          imgReadPath: res.json.imgReadPath,
          comment: comment,
          bottomToolbar: bottomToolbar
        }, () => {
          let swiper = me.data.goods.swiper
          let fineInfo = goods.fineInfo
          const fineArray = fineInfo.split('@')
          goods.fineArray = fineArray
          goods.swiper = swiper
          goods.image = goods.goodsItemList.find(obj => (obj.type == 1))
          me.forGoodsItemList(goods)
        })
      }
    })
  },
  forGoodsItemList(goods, index) {
    const me = this
    index = app.isNotNull(index) ? index : 0
    const goodsItem = goods.goodsItemList[index]
    if (goodsItem.type == 2) {
      goods.swiper.list.push(goodsItem.image)
    }
    index++
    if (index < goods.goodsItemList.length) {
      me.forGoodsItemList(goods, index)
    } else {
      me.setData({
        goods: goods
      })
    }
  },
  copy() {
    const me = this
    app.copy(me.data.goods.copyText)
  },
  /** 
   * 生成分享图片
   */
  shareImage() {
    const me = this
    share.detailShareImage(me, {
      imageUrl: me.data.imgReadPath + me.data.topImageUrl,
      title: me.data.content.title,
      success: res => {
        me.setData({
          showShare: true,
          shareImageUrl: res.shareImageUrl
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const me = this
    const goodsId = options.goodsId
    me.setData({
      goodsId: goodsId
    }, () => {
      me.loadGoods()
    })
    app.pageInit(me, {
      extraHeight: -70,
      success: res => {
        let bottomToolbar = me.data.bottomToolbar
        bottomToolbar.authScope = me.data.authScope
        me.setData({
          bottomToolbar: bottomToolbar
        })
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
  * 以下方法多个页面公用，因此提取到统一js中管理
  */
  focusCommentInput() {
    bottom.focusCommentInput(this)
  },
  commentTnput(e) {
    bottom.commentTnput(this, e)
  },
  addComment() {
    const me = this
    const data = {
      title: me.data.goods.title,
      entityId: me.data.goodsId,
      type: me.data.entityType
    }
    bottom.addComment(me, data)
  },
  addPraise() {
    const me = this
    const data = {
      title: me.data.goods.title,
      entityId: me.data.goodsId,
      type: me.data.entityType
    }
    bottom.addPraise(me, data)
  },
  cancelPraise() {
    const me = this
    const data = {
      entityId: me.data.goodsId
    }
    bottom.cancelPraise(me, data)
  },
  /**
   * 用户信息授权回调
   */
  onGetUserInfo() {
    authScope.onGetUserInfo(this)
  },
  /**
   * 关闭遮挡层
   */
  hideShareLayer: function (e) {
    share.hideShareLayer(this, e)
  },
  /** 
   * 生成分享图片
   */
  shareImage() {
    const me = this
    share.detailShareImage(me, {
      imageUrl: me.data.imgReadPath + me.data.topImageUrl,
      title: me.data.goods.title
    })
  }
})