// pages/user/collect.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      text: '我的收藏'
    },
    bottom: {
      text: '没有更多了',
      isText: true
    },
    menu: {
      choiceIndex: 0,
      list: [{
        type: -1,
        name: '全部'
      }, {
        type: 1,
        name: '图文'
      }, {
        type: 3,
        name: '视频'
      }]
    },
    list: []
  },
  /**
   * 点击菜单
   */
  tapMenu(e) {
    const me = this;
    const index = e.currentTarget.dataset.index
    let menu = me.data.menu
    menu.choiceIndex = index
    me.setData({
      menu: menu
    }, () => {
      me.loadCollectList()
    })
  },
  /**
   * 查询收藏
   */
  loadCollectList() {
    const me = this
    const menu = me.data.menu
    const data = {
      type: menu.list[menu.choiceIndex].type
    }
    app.request({
      data: data,
      url: 'collect/loadCollectList.do',
      success: res => {
        me.setData({
          imgReadPath: res.json.imgReadPath,
        }, () => {
          if (res.json.list.length > 0) {
            me.forList(res.json.list)
          } else {
            me.setData({
              list: []
            })
          }
        })
      }
    })
  },
  /**
   * 内容列表处理
   */
  forList(list, index) {
    const me = this
    index = app.isNotNull(index) ? index : 0
    let obj = list[index]
    obj.imgReadPath = me.data.imgReadPath
    let classType = 1;
    if (obj.type == 3) {
      classType = 3
    } else if (obj.type == 1) {
      const imageList = obj.imageList
      if (imageList.length == 3) {
        classType = Math.floor(Math.random() * 10) % 2 === 0 ? 1 : 2
      }
      if (classType == 1) {
        let imgIndex = app.random(0, imageList.length - 1)
        obj.image = imageList[imgIndex]
      }
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
    const me = this
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
    me.loadCollectList()
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