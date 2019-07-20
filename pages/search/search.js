// pages/search/search.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {},
    search: {
      value: ''
    },
    bottom: {
      text: '没有更多了',
      isText: false,
      isLoadNull: false,
      isLoadError: false
    },
    menu: {
      choiceIndex: 0,
      list: [{
        name: '图文'
      }, {
        name: '视频'
      }, {
        name: '达人'
      }]
    },
    contentList: [],
    videoList: [],
    userData: {}
  },
  /**
   * 重新输入查询内容
   */
  blurInput(e) {
    const me = this;
    let value = e.detail.value;
    value = app.trim(value)
    let search = me.data.search
    search.value = value
    me.setData({
      search: search
    }, () => {
      me.loadPage()
    })
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
      me.loadPage()
    })
  },
  /**
   * 查询处理事件
   */
  loadPage() {
    const me = this
    let bottom = me.data.bottom
    bottom.isText = false
    bottom.isLoadNull = false
    bottom.isLoadError = false
    me.setData({
      bottom: bottom
    }, () => {
      switch (me.data.menu.choiceIndex) {
        case 0:
          me.loadContentList()
          break;
        case 1:
          me.loadVideoList()
          break;
        case 2:
          me.loadAuthorList()
          break;
      }
    })
  },
  /**
   * 图文查询
   */
  loadContentList() {
    const me = this
    const data = {
      title: me.data.search.value
    }
    app.request({
      data: data,
      url: 'content/loadContentList.do',
      success: res => {
        me.setData({
          imgReadPath: res.json.imgReadPath
        }, () => {
          if (res.json.list.length > 0) {
            me.forList(res.json.list)
          } else {
            let bottom = me.data.bottom
            bottom.isLoadNull = true
            me.setData({
              bottom: bottom,
              contentList: []
            })
          }
        })
      }
    });
  },
  /**
   * 视频查询
   */
  loadVideoList() {
    const me = this
    const data = {
      title: me.data.search.value
    }
    app.request({
      data: data,
      url: 'video/loadVideoList.do',
      success: res => {
        if (res.json.list.length > 0) {
          me.forList(res.json.list)
        } else {
          let bottom = me.data.bottom
          bottom.isLoadNull = true
          me.setData({
            bottom: bottom,
            videoList: []
          })
        }
      }
    });
  },
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
      let bottom = me.data.bottom
      bottom.isText = true
      switch (me.data.menu.choiceIndex) {
        case 0:
          me.setData({
            bottom: bottom,
            contentList: list
          })
          break;
        case 1:
          me.setData({
            bottom: bottom,
            videoList: list
          })
      }
    }
  },
  /**
   * 查询达人
   */
  loadAuthorList() {
    const me = this
    const data = {
      nickName: me.data.search.value
    }
    app.request({
      url: 'user/loadAuthorList.do',
      data: data,
      success: res => {
        const list = res.json.userList
        const userData = {
          list: list
        }
        let bottom = me.data.bottom
        if (list.length == 0) {
          bottom.isLoadNull = true
        } else {
          bottom.isText = true
        }
        me.setData({
          bottom: bottom,
          userData: userData
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
  onLoad: function(options) {
    const me = this;
    const value = options.value
    let search = me.data.search
    search.value = value
    me.setData({
      search: search
    }, () => {
      me.loadContentList()
    })
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