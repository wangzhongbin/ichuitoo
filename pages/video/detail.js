// pages/video/detail.js

const app = getApp()

const bottom = require('../../utils/js/bottom.js')
const authScope = require('../../utils/js/auth-scope.js')
const share = require('../../utils/js/share.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoId: '',
    nav: {
      text: '视频详情'
    },
    entityType: 3, //评论、收藏、点赞时需要使用的类型
    imgReadPath: '',
    video: {},
    comment: {
      number: 0,
      list: []
    },
    randomList: [],
    bottomToolbar: {
      isFocus: false,
      commentInfo: '',
      isCollect: false,
      isPraise: false,
      praiseNumber: 0
    }
  },
  loadVideo() {
    const me = this
    const data = {
      videoId: me.data.videoId
    }
    app.request({
      url: 'video/loadVideo.do',
      data: data,
      success: res => {
        const video = res.json.video
        let comment = me.data.comment
        comment.number = video.commentNumber
        comment.list = res.json.commentList
        let bottomToolbar = me.data.bottomToolbar
        bottomToolbar.praiseNumber = video.praiseNumber
        bottomToolbar.isCollect = res.json.isCollect
        bottomToolbar.isPraise = res.json.isPraise
        video.videoUrl = res.json.videoReadPath + video.videoName
        me.setData({
          imgReadPath: res.json.imgReadPath,
          videoReadPath: res.json.videoReadPath,
          comment: comment,
          bottomToolbar: bottomToolbar,
          video: video
        }, () => {
          me.loadRandomVideoList()
        })
      }
    })
  },
  /**
   * 获取除当前外的随机5条数据
   */
  loadRandomVideoList() {
    const me = this
    const data = {
      randomNumber: 5,
      videoId: me.data.videoId
    }
    app.request({
      data: data,
      url: 'video/loadRandomVideoList.do',
      success: res => {
        me.setData({
          randomList: res.json.list
        })
      }
    });
  },
  copy() {
    const me = this
    app.copy(me.data.video.copyText)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const me = this
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
    const videoId = options.videoId
    me.setData({
      videoId: videoId
    }, () => {
      me.loadVideo()
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
      title: me.data.video.title,
      entityId: me.data.videoId,
      type: me.data.entityType
    }
    bottom.addComment(me, data)
  },
  addCollect() {
    const me = this
    const data = {
      title: me.data.video.title,
      entityId: me.data.videoId,
      type: me.data.entityType
    }
    bottom.addCollect(me, data)
  },
  cancelCollect() {
    const me = this
    const data = {
      entityId: me.data.videoId
    }
    bottom.cancelCollect(me, data)
  },
  addPraise() {
    const me = this
    const data = {
      title: me.data.video.title,
      entityId: me.data.videoId,
      type: me.data.entityType
    }
    bottom.addPraise(me, data)
  },
  cancelPraise() {
    const me = this
    const data = {
      entityId: me.data.videoId
    }
    bottom.cancelPraise(me, data)
  },
  /**
   * 授权回调
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
      imageUrl: me.data.imgReadPath + me.data.video.image.imgUrl,
      title: me.data.video.title
    })
  }
})