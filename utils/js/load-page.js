const app = getApp()

const scroll = (page, e) => {
  let scroll = page.data.scroll
  scroll.move = e.detail.scrollTop
  page.setData({
    scroll: scroll
  })
}

const touchStart = (page, e) => {
  if (!app.globalData.IOS) {
    let touch = page.data.touch
    if (touch.y == 0 && touch.move == 0) {
      touch.y = e.changedTouches[0].pageY
      page.setData({
        touch: touch
      })
    }
  }
}
const touchMove = (page, e) => {
  if (!app.globalData.IOS) {
    let touch = page.data.touch
    let move = e.changedTouches[0].pageY - page.data.touch.y
    if (move > 0) {
      // if (move > 50) {
      //   move = 50 + (move - 50) / 1.5
      // }
      if (move > 80) {
        move = 80 + (move - 80) / 1.5
      }
      if (move > 100) {
        move = 100 + (move - 100) / 2
      }
      if (move > 120) {
        move = 120 + (move - 120) / 2.5
      }
      // if (move > 140) {
      //   move = 140 + (move - 140) / 3.5
      // }
      if (move > 150) {
        move = 150
      }
      touch.move = move
      page.setData({
        touch: touch
      })
    }
  }
}
const touchEnd = (page, e) => {
  //IOS
  if (app.globalData.IOS) {
    const scroll = page.data.scroll
    if (scroll.move <= -55) {
      const touch = page.data.touch
      touch.move = 100
      touch.time = 500
      page.setData({
        isLoadPage: true,
        touch: touch
      }, () => {
        page.loadPage()
      })
    }
  } else {
    //安卓
    const touch = page.data.touch
    if (touch.move > 0) {
      if (touch.move >= 100) {
        touch.move = 100
        touch.time = 500
        page.setData({
          isLoadPage: true,
          touch: touch
        }, () => {
          page.loadPage()
        })
      } else {
        loadEnd(page)
      }
    }
  }
}

const loadEnd = page => {
  let touch = page.data.touch
  touch.y = 0
  touch.move = 0
  touch.time = 500
  page.setData({
    isLoadPage: false,
    touch: touch
  }, () => {
    touch.y = 0
    touch.move = 0
    touch.time = 0
    page.setData({
      touch: touch
    })
  })
}

module.exports = {
  scroll: scroll,
  touchStart: touchStart,
  touchMove: touchMove,
  touchEnd: touchEnd,
  loadEnd: loadEnd
}