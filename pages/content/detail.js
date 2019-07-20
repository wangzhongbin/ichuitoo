// pages/content/detail.js

const app = getApp()

const bottom = require('../../utils/js/bottom.js')
const authScope = require('../../utils/js/auth-scope.js')
const share = require('../../utils/js/share.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentId: '',
    topImageUrl: '',
    nav: {
      text: '详细资讯'
    },
    entityType: 1, //评论、收藏、点赞时需要使用的类型
    imgReadPath: '',
    content: {},
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
    },
    user: {
      fans: false,
      like: false,
      self: true
    }
  },
  loadContent() {
    const me = this
    const data = {
      contentId: me.data.contentId
    }
    app.request({
      url: 'content/loadContent.do',
      data: data,
      success: res => {
        const content = res.json.content
        let comment = me.data.comment
        comment.number = content.textCount.commentNumber
        comment.list = res.json.commentList
        let bottomToolbar = me.data.bottomToolbar
        bottomToolbar.praiseNumber = content.textCount.praiseNumber
        bottomToolbar.isCollect = res.json.isCollect
        bottomToolbar.isPraise = res.json.isPraise
        const user = {
          fans: res.json.fans,
          like: res.json.like,
          self: res.json.self
        }
        const contentItemList = content.contentItemList
        const topItem = contentItemList.find(obj => (obj.type == 1))
        let topImageUrl = topItem.image.imgUrl
        me.setData({
          topImageUrl: topImageUrl,
          imgReadPath: res.json.imgReadPath,
          content: content,
          user: user,
          comment: comment,
          bottomToolbar: bottomToolbar
        })
      }
    })
  },
  copy() {
    const me = this
    app.copy(me.data.content.copyText)
  },
  /**
   * 关注达人
   */
  addLike() {
    const me = this
    const content = me.data.content
    const data = {
      likeUserId: content.user.id
    }
    app.request({
      url: 'userFans/addLike.do',
      data: data,
      success: res => {
        let user = me.data.user
        user.fans = true
        me.setData({
          user: user
        }, () => {
          app.toast('关注成功')
        })
      }
    })
  },
  /**
   * 取消关注
   */
  cancelLike() {
    const me = this
    const content = me.data.content
    const data = {
      likeUserId: content.user.id
    }
    app.request({
      url: 'userFans/cancelLike.do',
      data: data,
      success: res => {
        let user = me.data.user
        user.fans = false
        me.setData({
          user: user
        }, () => {
          app.toast('取消关注')
        })
      }
    })
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
    const contentId = options.contentId
    me.setData({
      contentId: contentId
    }, () => {
      me.loadContent()
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
    const me = this
    const obj = {
      data: {
        entityId: me.data.contentId
      }
    }
    return app.onShareAppMessage(obj)
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
      title: me.data.content.title,
      entityId: me.data.contentId,
      type: me.data.entityType
    }
    bottom.addComment(me, data)
  },
  addCollect() {
    const me = this
    const data = {
      title: me.data.content.title,
      entityId: me.data.contentId,
      type: me.data.entityType
    }
    bottom.addCollect(me, data)
  },
  cancelCollect() {
    const me = this
    const data = {
      entityId: me.data.contentId
    }
    bottom.cancelCollect(me, data)
  },
  addPraise() {
    const me = this
    const data = {
      title: me.data.content.title,
      entityId: me.data.contentId,
      type: me.data.entityType
    }
    bottom.addPraise(me, data)
  },
  cancelPraise() {
    const me = this
    const data = {
      entityId: me.data.contentId
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
      title: me.data.content.title
    })
  }
})