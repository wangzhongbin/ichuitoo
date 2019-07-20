// pages/content/add.js

const app = getApp()

const imageUtil = require('../../utils/js/image-util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      text: '发布文章',
      isIPX: false,
      isFirstPage: false,
      scrollHeight: 0
    },
    content: {
      id: ''
    },
    topList: [],
    type: {},
    tagList: [],
    copyText: '',
    isDisabled: false
  },
  chooseImage() {
    const me = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      count: 1,
      success: function(res) {
        imageUtil.compressImages({
          paths: res.tempFilePaths,
          success: res => {
            let topList = me.data.topList
            let sort = topList.length > 0 ? topList[topList.length - 1].sort + 1 : 1;
            topList.push({
              sort: sort,
              type: 1,
              imgUrl: res.paths[0]
            })
            me.setData({
              topList: topList
            })
          }
        })
      }
    });
  },
  addContent() {
    const me = this
    const topList = me.data.topList
    if (topList.length == 0){
      app.toast('头图未选择')
      return false
    }
    const typeId = me.data.type.id
    if (app.isNull(typeId)){
      app.toast('文章类型未选择')
      return false
    }
    const tagList = me.data.tagList
    if (tagList.length == 0) {
      app.toast('文章标签未选择')
      return false
    }
    me.setData({
      isDisabled: true
    })
    imageUtil.uploadImages({
      imageList: topList,
      uploadPath: 'content',
      success: res => {
        me.setData({
          topList: res.imageList
        }, () => {
          var data = {
            contentId: me.data.content.id,
            typeId: typeId,
            copyText: me.data.copyText,
            tags: JSON.stringify(tagList),
            items: JSON.stringify(topList)
          }
          app.request({
            url: 'content/updateContent.do',
            data: data,
            success: res => {
              wx.showModal({
                showCancel: false,
                content: '发布成功',
                success: res => {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '/pages/user/content'
                    })
                  }
                }
              })
            }
          })
        })
      }
    })
  },
  deleteImg(e){
    const me = this
    wx.showModal({
      content: '确定删除',
      cancelText: '取消',
      confirmText: '删除',
      success(res) {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index
          let topList = me.data.topList
          topList.splice(index, 1)
          me.setData({
            topList: topList
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const me = this
    app.pageInit(me)
    let content = me.data.content
    content.id = options.contentId
    me.setData({
      content: content
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

  }
})