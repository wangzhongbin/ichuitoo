const app = getApp()

const onGetUserInfo = (page, obj) => {
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        app.globalData.authScope.userInfo = true
        app.authUserInfo()
        let authScope = page.data.authScope
        authScope.userInfo = true
        let bottomToolbar = ''
        if (app.isNotNull(page.data.bottomToolbar)) {
          bottomToolbar = page.data.bottomToolbar
          bottomToolbar.authScope = authScope
        }
        page.setData({
          authScope: authScope,
          bottomToolbar: bottomToolbar
        }, () => {
          if (app.isNotNull(obj) && app.isFunction(obj.success)) {
            obj.success();
          }
        })
      }
    }
  })
}

module.exports = {
  onGetUserInfo: onGetUserInfo
}