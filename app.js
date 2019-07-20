//app.js

const util = require('utils/util.js')
const ajax = require('utils/js/ajax.js')

App({
  isLogin: false, 
  onLaunch: function() {
    const me = this
    if (wx.getSystemInfoSync().system.search('iOS') != -1) {
      me.globalData.IOS = true;
    }
    me.loadAuthScope()
    me.login()
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  /**
   * 常量
   */
  globalData: {
    IOS: false,
    authScope: { userInfo: false },
    // contextPath: 'http://localhost:8210/program/',
    contextPath: 'https://testwx.aikaixin.com/program/',
    sessionKey: '',
    excludedUrls: ['user/login.do'],
    header: {
      'Cache-Control': 'max-age=7200',
      'content-type': 'application/x-www-form-urlencoded',
      'x-requested-with': 'XMLHttpRequest'
    }
  },
  /**
   * 登录获取openid返回sessionKey
   */
  login() {
    const me = this;
    wx.login({
      success: res => {
        var data = {
          code: res.code
        };
        me.request({
          url: 'user/login.do',
          data: data,
          success: res => {
            if (res.success) {
              me.globalData.sessionKey = res.json.sessionKey;
              me.isLogin = true;
            }
          }
        });
      }
    });
  },
  /**
   * 授权查询，其他页面授权操作后去要更新app.js中的数据
   */
  loadAuthScope() {
    const me = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          me.globalData.authScope.userInfo = true
          me.authUserInfo()
        }
      }
    })
  },
  /**
   * 页面初始化需要的一些信息和数据
   * success回调
   */
  pageInit(page, obj) {
    const me = this;
    let extraHeight = 0
    if (me.isNotNull(obj)) {
      extraHeight = obj.extraHeight
      extraHeight = me.isNotNull(extraHeight) ? extraHeight : 0
    }
    let nav = page.data.nav
    const systemInfo = wx.getSystemInfoSync()
    if (systemInfo.model.search('iPhone X') != -1) {
      nav.isIPX = true
    }
    nav.scrollHeight = systemInfo.windowHeight - systemInfo.statusBarHeight - 45 + extraHeight
    if (getCurrentPages().length == 1) {
      nav.isFirstPage = true;
    }
    page.setData({
      nav: nav,
      authScope: me.globalData.authScope
    },()=>{
      if (me.isNotNull(obj) && me.isFunction(obj.success)) {
        obj.success();
      }
    })
  },
  isNotNull(value) {
    return util.isNotNull(value)
  },
  isNull(value) {
    return !this.isNotNull(value)
  },
  trim(value) {
    return util.trim(value)
  },
  alert(str) {
    return util.showModal(str)
  },
  /**
   * 提示两秒后自动消失
   */
  toast(str, icon) {
    icon = this.isNotNull(icon) ? icon:'none'
    return util.showToast(str, icon)
  },
  random(minNum, maxNum) {
    return util.randomNum(minNum, maxNum)
  },
  isFunction(obj) {
    return util.isFunction(obj)
  },
  isInArray(array, str) {
    return util.isInArray(array, str)
  },
  copy(str){
    const me = this
    if (me.isNotNull(str)) {
      wx.setClipboardData({
        data: str
      })
    }
  },
  /**
   * url白名单
   */
  isExcluded(url) {
    const me = this;
    return util.isInArray(me.globalData.excludedUrls, url);
  },
  /**
   * 保存用户授权信息，保存到数据库后保存到本地，如检测到本地信息与获取到的信息一致时，不提交服务端
   */
  authUserInfo() {
    const me = this;
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo;
        wx.getStorageInfo({
          success(res) {
            if (res.keys.indexOf('userInfo') == -1) {
              me.saveUserInfo(userInfo)
            } else {
              wx.getStorage({
                key: 'userInfo',
                success(res) {
                  if (res.data.nickName != userInfo.nickName ||
                    res.data.avatarUrl != userInfo.avatarUrl) {
                    me.saveUserInfo(userInfo)
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  /**
   * 保存数据库并且缓存本地
   */
  saveUserInfo(userInfo) {
    const me = this;
    me.request({
      url: 'user/saveUserInfo.do',
      data: userInfo,
      success(res) {
        wx.setStorage({
          key: 'userInfo',
          data: userInfo
        })
      }
    })
  },
  /**
   * 请求方法封装，data中自动带上sessionKey
   */
  request: function(obj) {
    const me = this;
    const int = setInterval(function() {
      if (me.isLogin || me.isExcluded(obj.url)) {
        clearInterval(int);
        ajax.request(me, obj)
      }
    }, 50);
  },
  onShareAppMessage: function (obj) {
    const me = this
    return {
      success: function (res) {
        me.request({
          url: 'share/addShare.do',
          data: obj.data,
          success(res) {
            app.toast('分享成功')
          }
        })
      },
      fail: function (res) {
        app.toast('分享失败')
      }
    }
  }
})