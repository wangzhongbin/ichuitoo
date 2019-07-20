// pages/index/index.js

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
    pageType: 1,
    imgReadPath: '',
    nav: {
      loading: true
    },
    bottom: {
      text: '没有更多了',
      isText: true
    },
    menu: {
      choiceIndex: 0,
      list: []
    },
    //头条数据
    indexData: {
      swiper: {
        current: 0,
        list: []
      },
      list: []
    },
    //好文数据
    contentTypeId: '',
    contentDataList: [],
    contentData: [],
    //视频数据
    videoData: {
      list: []
    },
    //达人推荐数据
    userData: {
      type: {
        choiceIndex: 0,
        list: {}
      },
      list: []
    }
  },
  scrollTolower(e){
    // console.log('scrollTolower', e)
  },
  /**
   * 搜索查询
   */
  blurInput(e) {
    const me = this;
    let value = e.detail.value;
    value = app.trim(value)
    if (app.isNotNull(value)) {
      wx.navigateTo({
        url: '/pages/search/search?value=' + value
      })
    }
  },
  /**
   * 头条轮播事件
   */
  swiperChange(e) {
    const me = this;
    let indexData = me.data.indexData
    indexData.swiper.current = e.detail.current
    me.setData({
      indexData: indexData
    })
  },
  /**
   * 加载首页信息
   */
  loadIndexInfo() {
    const me = this
    const data = {
      current: 0,
      size: 50
    }
    app.request({
      data: data,
      url: 'index/loadIndexInfo.do',
      success: res => {
        let menu = me.data.menu
        menu.list = res.json.menuList
        let indexData = me.data.indexData
        indexData.swiper.list = res.json.adList
        indexData.list = res.json.indexList
        me.setData({
          imgReadPath: res.json.imgReadPath,
          menu: menu,
          indexData: indexData
        }, () => {
          if (app.isNotNull(indexData.list) && indexData.list.length > 0){
            me.forList(indexData.list)
          }
        })
      }
    })
  },
  /**
   * 随机加载20条
   */
  randomIndexList() {
    const me = this
    const data = {
      size: 20
    }
    app.request({
      data: data,
      url: 'index/randomIndexList.do',
      success: res => {
        const list = res.json.list
        if (app.isNotNull(list) && list.length > 0) {
          me.forList(list)
        } else {
          loadPage.loadEnd(me)
        }
      }
    })
  },
  /**
   * 加载好文内容
   */
  loadContentList() {
    const me = this
    const contentTypeId = me.data.contentTypeId
    const data = {
      typeId: contentTypeId
    }
    app.request({
      url: 'content/loadContentList.do',
      data: data,
      success: res => {
        const list = res.json.list
        if (app.isNotNull(list) && list.length > 0){
          me.forList(list)
        }else{
          loadPage.loadEnd(me)
        }
      }
    })
  },
  /**
   * 加载视频内容
   */
  loadVideoList() {
    const me = this
    app.request({
      url: 'video/loadVideoList.do',
      success: res => {
        const list = res.json.list
        if (app.isNotNull(list) && list.length > 0){
          me.forList(list)
        }else{
          loadPage.loadEnd(me)
        }
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
    let classType = 1
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
      switch (me.data.pageType) {
        case 1:
          let indexData = me.data.indexData
          if (indexData.list.length > 0){
              const index = indexData.list.findIndex(obj => (obj.flag == true))
              if(index != -1){
                indexData.list[index] = false
              }
            indexData.list.unshift({
              flag: true
            })
          }
          me.setData({
            indexData: {
              swiper: indexData.swiper,
              list: list.concat(indexData.list)
            }
          }, () => {
            if (me.data.isLoadPage) {
              loadPage.loadEnd(me)
            }
          })
          break;
        case 2:
          let contentDataList = me.data.contentDataList
          contentData = {
            typeId: me.data.contentTypeId,
            list: list
          }
          let index = contentDataList.findIndex((obj) => (obj.typeId == me.data.contentTypeId))
          if (index == -1) {
            contentDataList.push(contentData)
          } else {
            contentDataList[index].list = list
          }
          me.setData({
            contentData: contentData,
            contentDataList: contentDataList
          }, () => {
            if (me.data.isLoadPage) {
              loadPage.loadEnd(me)
            }
          })
          break;
        case 3:
          let videoData = me.data.videoData
          videoData.list = list
          me.setData({
            videoData: videoData
          }, () => {
            if (me.data.isLoadPage) {
              loadPage.loadEnd(me)
            }
          })
          break;
      }
    }
  },
  /**
   * 点击菜单
   */
  tapMenu(e) {
    const me = this;
    const index = e.currentTarget.dataset.index
    let menu = me.data.menu
    menu.choiceIndex = index
    const pageType = menu.list[index].type
    me.setData({
      pageType: pageType,
      menu: menu
    }, () => {
      switch (pageType) {
        case 1:
          break;
        case 2:
          const typeId = menu.list[index].entityId
          me.setData({
            contentTypeId: typeId
          }, () => {
            const contentDataList = me.data.contentDataList
            const index = contentDataList.findIndex((obj) => (obj.typeId == typeId))
            if (index == -1) {
              me.loadContentList(typeId)
            } else {
              me.setData({
                contentData: contentDataList.find((obj) => (obj.typeId == typeId))
              })
            }
          })
          break;
        case 3:
          const videoData = me.data.videoData
          if (app.isNull(videoData.list) || videoData.list.length == 0) {
            me.loadVideoList()
          }
          break;
        case 4:
          const userData = me.data.userData
          if (app.isNull(userData.list) || userData.list.length == 0) {
            me.loadAuthorList()
          }
          break;
      }
    })
  },
  /**
   * 刷新页面
   */
  loadPage() {
    const me = this
    const pageType = me.data.pageType
    switch (pageType) {
      case 1:
        me.randomIndexList()
        break;
      case 2:
        const typeId = me.data.menu.list[me.data.menu.choiceIndex].entityId
        me.loadContentList(typeId)
        break;
      case 3:
        me.loadVideoList()
        break;
      case 4:
        me.loadAuthorList()
        break;
    }
  },
  /**
   * 加载达人列表
   */
  loadAuthorList(userTypeIndex) {
    const me = this
    let userData = me.data.userData
    let typeId = ''
    userTypeIndex = app.isNotNull(userTypeIndex) ? userTypeIndex : 0
    if (userData.type.list.length > 0) {
      typeId = userData.type.list[userTypeIndex].id
    }
    const data = {
      typeId: typeId
    }
    app.request({
      url: 'user/loadAuthorList.do',
      data: data,
      success: res => {
        let typeList = res.json.typeList
        typeList.unshift({
          id: '',
          name: '全部达人'
        })
        userData.list = res.json.userList
        userData.type.choiceIndex = userTypeIndex
        userData.type.list = typeList
        me.setData({
          userData: userData
        }, () => {
          loadPage.loadEnd(me)
        })
      }
    });
  },
  /**
   * 达人页面小菜单
   */
  tapUserType(e) {
    const me = this
    const index = e.currentTarget.dataset.index
    me.loadAuthorList(index)
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
   * 广告url跳转
   */
  toAdPage(e) {
    const me = this
    const index = e.currentTarget.dataset.index
    const indexData = me.data.indexData
    const ad = indexData.swiper.list[index]
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
    me.loadIndexInfo()
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