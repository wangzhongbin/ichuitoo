// pages/content/tag.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgReadPath: app.globalData.imgReadPath,
    nav: {
      text: '选择文章标签',
      isIPX: false,
      isFirstPage: false,
      scrollHeight: 0
    },
    choiceList: [],
    tagList: []
  },
  choice(e) {
    const me = this
    let tagList = me.data.tagList
    let choiceList = me.data.choiceList
    if (choiceList.length >= 6){
      app.toast('最多只能选择6个标签')
      return false
    }
    const index = e.currentTarget.dataset.index
    choiceList.push(tagList[index])
    tagList[index].isChoice = true
    me.setData({
      tagList: tagList,
      choiceList: choiceList
    }, () => {
      getCurrentPages()[getCurrentPages().length - 2].setData({
        tagList: choiceList
      })
    })
  },
  delete(e) {
    const me = this
    let choiceList = me.data.choiceList
    const index = e.currentTarget.dataset.index
    let tagList = me.data.tagList
    const tagIndex = tagList.findIndex((obj) => (obj.id == choiceList[index].id))
    tagList[tagIndex].isChoice = false
    choiceList.splice(index, 1)
    me.setData({
      choiceList: choiceList,
      tagList: tagList
    }, () => {
      getCurrentPages()[getCurrentPages().length - 2].setData({
        tagList: choiceList
      })
    })
  },
  loadTagList() {
    const me = this
    app.request({
      url: 'content/loadContentTagList.do',
      success: res => {
        me.setData({
          imgReadPath: res.json.imgReadPath
        })
        let tagList = res.json.list
        const choiceList = getCurrentPages()[getCurrentPages().length - 2].data.tagList
        if (choiceList.length > 0) {
          me.forList(tagList, choiceList)
        } else {
          me.setData({
            tagList: tagList
          })
        }
      }
    })
  },
  forList(tagList, choiceList, index) {
    const me = this
    index = app.isNotNull(index) ? index : 0
    const findIndex = tagList.findIndex((obj) => (obj.id == choiceList[index].id))
    if (findIndex >= 0) {
      tagList[findIndex].isChoice = true
    }
    index++
    if (index < choiceList.length) {
      me.forList(tagList, choiceList, index)
    } else {
      me.setData({
        tagList: tagList,
        choiceList: choiceList
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const me = this
    app.pageInit(me)
    me.loadTagList()
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