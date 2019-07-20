// pages/content/write.js

const app = getApp()

const imageUtil = require('../../utils/js/image-util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      text: '写文章'
    },
    count: {
      maxText: 20,
      text: 0,
      maxImg: 40,
      img: 0
    },
    content: {
      id: '',
      title: ''
    },
    showTextarea: false,
    itemList: [],
    choiceItem: {
      index: -1,
      text: ''
    },
    isDisabled: false
  },
  /**
   * 获取标题
   */
  titleInput(e) {
    const me = this
    let content = me.data.content
    content.title = e.detail.value
    me.setData({
      content: content
    })
  },
  /**
   * 获取正文
   */
  textInput(e) {
    const me = this
    const choiceItem = me.data.choiceItem
    choiceItem.text = e.detail.value
    me.setData({
      choiceItem: choiceItem
    })
  },
  /**
   * 添加图片或文本
   */
  addItem(obj) {
    const me = this
    let itemList = me.data.itemList
    let sort = 0
    if (itemList.length > 0) {
      sort = itemList[itemList.length - 1].sort + 1
    }
    obj.sort = sort
    itemList.push(obj)
    let count = me.data.count
    switch (obj.type) {
      case 2:
        count.img = count.img + 1
        me.setData({
          itemList: itemList,
          count: count
        })
        break;
      case 3:
        count.text = count.text + 1
        me.setData({
          itemList: itemList,
          count: count,
          showTextarea: false,
          choiceItem: {
            index: -1,
            text: ''
          }
        })
        break;
    }
  },
  /**
   * 添加文本
   */
  addText() {
    const me = this
    if (me.data.count.text < me.data.count.maxText) {
      me.setData({
        showTextarea: true,
        choiceItem: {
          text: ''
        }
      })
    } else {
      app.toast('已经到达上限')
    }
  },
  /**
   * 编辑文本
   */
  updateText(e) {
    const me = this
    const index = e.currentTarget.dataset.index
    const choiceItem = {
      index: index,
      text: me.data.itemList[index].text
    }
    me.setData({
      showTextarea: true,
      choiceItem: choiceItem
    })
  },
  /**
   * 弹出框取消
   */
  itemTextCancel() {
    const me = this
    me.setData({
      showTextarea: false,
      choiceItem: {
        index: -1,
        text: ''
      }
    })
  },
  /**
   * 弹出框确认
   */
  itemTextConfirm() {
    const me = this
    const choiceItem = me.data.choiceItem
    if (app.isNotNull(choiceItem.text)) {
      if (choiceItem.index >= 0) {
        let itemList = me.data.itemList
        itemList[choiceItem.index].text = choiceItem.text
        me.setData({
          itemList: itemList,
          showTextarea: false,
          choiceItem: {
            index: -1,
            text: ''
          }
        })
      } else {
        me.addItem({
          type: 3,
          text: choiceItem.text
        })
      }
    } else {
      me.itemTextCancel()
    }
  },
  /**
   * 删除
   */
  deleteItem(e) {
    const me = this
    wx.showModal({
      content: '确定删除',
      cancelText: '取消',
      confirmText: '删除',
      success(res) {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index
          let itemList = me.data.itemList
          let count = me.data.count
          const type = itemList[index].type
          if (type == 2) {
            count.img = count.img - 1
          }
          if (type == 3) {
            count.text = count.text - 1
          }
          itemList.splice(index, 1)
          me.setData({
            itemList: itemList,
            count: count
          })
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 保存按钮
   */
  save() {
    const me = this
    if (app.isNull(me.data.content.title)) {
      app.toast('标题未输入')
      return false
    }
    const itemList = me.data.itemList
    const index = itemList.findIndex(obj => (obj.type == 3))
    if (index < 0) {
      app.toast('至少输入一段正文文本')
      return false
    }
    me.setData({
      isDisabled: true
    })
    imageUtil.uploadImages({
      imageList: me.data.itemList,
      uploadPath: 'content',
      success: res => {
        me.setData({
          itemList: res.imageList
        }, () => {
          me.saveContent({
            success: res => {
              app.toast('保存成功')
              me.setData({
                isDisabled: false
              })
            }
          })
        })
      }
    })
  },
  /**
   * 下一步按钮
   */
  next() {
    const me = this
    if (app.isNull(me.data.content.title)) {
      app.toast('标题未输入')
      return false
    }
    const itemList = me.data.itemList
    const index = itemList.findIndex(obj => (obj.type == 3))
    if (index < 0) {
      app.toast('至少输入一段正文文本')
      return false
    }
    me.setData({
      isDisabled: true
    })
    imageUtil.uploadImages({
      imageList: me.data.itemList,
      uploadPath: 'content',
      success: res => {
        me.setData({
          itemList: res.imageList
        }, () => {
          me.saveContent({
            success: res => {
              let url = '/pages/content/add?contentId=' + res.contentId
              wx.navigateTo({
                url: url
              })
            }
          })
        })
      }
    })
  },
  /**
   * 保存数据
   */
  saveContent(obj) {
    const me = this
    let content = me.data.content
    const data = {
      contentId: content.id,
      title: content.title,
      items: JSON.stringify(me.data.itemList)
    }
    app.request({
      url: 'content/addContent.do',
      data: data,
      success: res => {
        content.id = res.json.contentId
        me.setData({
          content: content
        }, () => {
          obj.success({
            contentId: res.json.contentId
          })
        })
      }
    })
  },
  /**
   * 选择图片
   */
  chooseImage(e) {
    const me = this;
    let count = me.data.count
    if (count.img < count.maxImg) {
      wx.chooseImage({
        sizeType: ['compressed'],
        count: 1,
        success: function(res) {
          imageUtil.compressImages({
            paths: res.tempFilePaths,
            success: res => {
              me.addItem({
                type: 2,
                imgUrl: res.paths[0]
              })
            }
          })
        }
      });
    } else {
      app.toast('已经到达上限')
    }
  },
  /**
   * 草稿内容编辑
   */
  loadWriteContent() {
    const me = this
    const data = {
      contentId: me.data.contentId
    }
    app.request({
      url: 'content/loadWriteContent.do',
      data: data,
      success: res => {
        const content = res.json.content
        me.setData({
          imgReadPath: res.json.imgReadPath,
          itemList: content.contentItemList,
          content: {
            id: content.id,
            title: content.title
          }
        })
        let count = me.data.count
        me.forCount(content.contentItemList, count)
      }
    })
  },
  forCount(list, count, index) {
    const me = this
    index = app.isNotNull(index) ? index : 0
    if (list[index].type == 2) {
      count.img = count.img + 1
    }
    if (list[index].type == 3) {
      count.text = count.text + 1
    }
    index++
    if (index < list.length) {
      me.forCount(list, count, index)
    } else {
      me.setData({
        count: count
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const me = this
    app.pageInit(me)
    const contentId = options.contentId
    if (app.isNotNull(contentId)) {
      me.setData({
        contentId: contentId
      }, () => {
        me.loadWriteContent()
      })
    }
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