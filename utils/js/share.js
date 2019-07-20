const app = getApp()

/** 
 * 生成分享图片并展示，需要先设置shareCanvas为可见，生成图片完成后在设置为不可见
 */
const detailShareImage = (page, obj) => {
  let share = page.data.share
  if (app.isNull(share) || app.isNull(share.imageUrl)) {
    share = {
      showShare: false,
      showCanvas: true,
      imageUrl: ''
    }
    page.setData({
      share: share
    }, () => {
      const ctx = wx.createCanvasContext('shareCanvas')
      ctx.setFillStyle('transparent')
      ctx.fillRect(0, 0, 540, 604)
      ctx.drawImage('../../images/share-bg.png', 0, 0, 540, 604)
      ctx.drawImage(obj.imageUrl, 20, 20, 500, 326)
      ctx.setFillStyle('#333')
      ctx.setFontSize(30)
      const title = obj.title
      let titleArray = new Array()
      if (title.length > 17) {
        titleArray[0] = title.substr(0, 17)
        titleArray[1] = title.substr(17, title.length - 1)
      } else {
        titleArray[0] = title
        titleArray[1] = ''
      }
      ctx.fillText(titleArray[0], 20, 390)
      ctx.fillText(titleArray[1], 20, 435)
      ctx.drawImage('../../images/code.png', 20, 485, 100, 100)
      ctx.setFontSize(24)
      ctx.fillText('为您推荐一篇超赞的内容！', 140, 527)
      ctx.fillText('长按识别小程序码了解详细内容。', 140, 563)
      //完成绘画之后展示并生成图片
      ctx.stroke()
      ctx.draw(true, function() {
        wx.canvasToTempFilePath({
          canvasId: 'shareCanvas',
          complete: function() {
            wx.hideLoading()
          },
          success: function(res) {
            page.setData({
              share: {
                btnText: '正在保存...',
                showCanvas: false,
                showShare: true,
                imageUrl: res.tempFilePath
              }
            }, () => {
              saveShareImage(page, res.tempFilePath)
            })
          },
          fail: function(res) {
            app.toast('生成图片失败，请重试')
          }
        })
      })
    })
  } else {
    share.btnText = '正在保存...'
    share.showShare = true
    page.setData({
      share: share
    }, () => {
      saveShareImage(page, share.imageUrl)
    })
  }
}

const saveShareImage = (page, tempFilePath) => {
  wx.getSetting({
    success: function(res) {
      const authScopeWritePhotosAlbum = res.authSetting['scope.writePhotosAlbum']
      if (authScopeWritePhotosAlbum === undefined) {
        saveImage(page, tempFilePath)
      } else {
        if (authScopeWritePhotosAlbum) {
          saveImage(page, tempFilePath)
        } else {
          let share = page.data.share
          share.btnText = '保存失败'
          page.setData({
            share: share
          })
          app.toast('获取保存到相册权限失败')
        }
      }
    }
  })
}

const saveImage = (page, tempFilePath) => {
  wx.showLoading({
    mask: true
  });
  wx.saveImageToPhotosAlbum({
    filePath: tempFilePath,
    success: function(res) {
      app.toast('图片已保存至相册')
      let share = page.data.share
      share.btnText = '保存成功'
      page.setData({
        share: share
      })
    },
    complete: function() {
      wx.hideLoading()
    },
    fail: function(res) {
      app.toast('保存图片失败，请重试')
      let share = page.data.share
      share.btnText = '保存失败'
      page.setData({
        share: share
      })
    }
  })
}

const hideShareLayer = (page, e) => {
  let share = page.data.share
  share.showShare = false
  const close = e.target.dataset.close
  if (close == '1') {
    page.setData({
      share: share
    })
  }
}

module.exports = {
  detailShareImage: detailShareImage,
  hideShareLayer: hideShareLayer
}