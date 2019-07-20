const app = getApp()
/**
 * 上传文件success回调
 */
const uploadImage = obj => {
  filePath = obj.filePath
  if (app.isNotNull(filePath)) {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '上传中',
      mask: true
    });
    let data = obj.data
    data.sessionKey = app.globalData.sessionKey
    data.suffix = filePath.substring(filePath.lastIndexOf('.'), filePath.length)
    wx.uploadFile({
      url: app.globalData.contextPath + 'image/upload.do',
      filePath: filePath,
      name: 'file',
      formData: data,
      complete: res => {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (app.isFunction(obj.complete)) {
          obj.complete();
        }
      },
      success: res => {
        if (app.isNotNull(res)) {
          var resData = JSON.parse(res.data);
          if (resData.success) {
            if (app.isFunction(obj.success)) {
              obj.success(resData);
            }
          } else {
            app.alert(resData.msg);
          }
        }
      },
      fail: res => {
        app.alert('上传失败');
      }
    })
  } else {
    if (app.isFunction(obj.complete)) {
      obj.complete();
    }
  }
}

/**
 * 批量上传文件success回调
 */
const uploadImages = obj => {
  const me = this
  if (obj.imageList.length > 0) {
    let index = obj.index
    index = app.isNotNull(index) ? index : 0
    const img = obj.imageList[index]
    index++
    obj.index = index
    uploadImage({
      data: {
        path: obj.uploadPath
      },
      filePath: img.imgUrl,
      complete: res => {
        if (index < obj.imageList.length) {
          uploadImages(obj)
        } else {
          if (app.isFunction(obj.success)) {
            obj.success(obj)
          }
        }
      },
      success: res => {
        img.imageId = res.json.imageId
        obj.imageList[index - 1] = img
      }
    })
  } else {
    if (app.isFunction(obj.success)) {
      obj.success(obj)
    }
  }
}

/**
 * 批量图片压缩
 */
const compressImages = obj => {
  obj.success({
    paths: obj.paths
  })
  // const me = this;
  // let index = obj.index
  // index = app.isNotNull(index) ? index : 0
  // const path = obj.paths[index]
  // index++
  // obj.index = index
  // wx.showLoading({
  //   title: '压缩中',
  //   mask: true
  // });
  // wx.compressImage({
  //   src: path,
  //   quality: 10,
  //   complete: res => {
  //     wx.hideLoading();
  //   },
  //   success: res => {
  //     if (index < obj.paths.length) {
  //       compressImages(obj)
  //     } else {
  //       if (app.isFunction(obj.success)) {
  //         obj.success({
  //           paths: obj.paths
  //         })
  //       }
  //     }
  //   },
  //   fail: res => {
  //     app.alert(res.errMsg)
  //   }
  // })
}

module.exports = {
  uploadImage: uploadImage,
  uploadImages: uploadImages,
  compressImages: compressImages
}