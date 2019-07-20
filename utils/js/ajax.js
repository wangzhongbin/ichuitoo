
/**
 * ajax请求后台数据
 */
const request = (app, obj) => {
  wx.showNavigationBarLoading();
  wx.showLoading({
    mask: true
  });
  let data = typeof obj.data === 'object' ? obj.data : {}
  data.sessionKey = app.globalData.sessionKey
  wx.request({
    url: app.globalData.contextPath + obj.url,
    header: app.globalData.header,
    data: data,
    method: 'POST',
    complete: res => {
      wx.hideNavigationBarLoading();
      wx.hideLoading();
    },
    success: res => {
      if (app.isNotNull(res.data)) {
        if (res.data.success) {
          if (app.isFunction(obj.success)) {
            obj.success(res.data);
          }
        } else {
          app.toast(res.data.msg);
        }
      }
    },
    fail: res => {
      app.toast('网络错误');
      if (app.isFunction(obj.fail)) {
        obj.fail(res);
      }
    }
  })
}

module.exports = {
  request: request
}