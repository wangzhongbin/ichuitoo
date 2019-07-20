const app = getApp()

/**
 * 获取底部评论输入框焦点
 */
const focusCommentInput = page => {
  let bottomToolbar = page.data.bottomToolbar
  bottomToolbar.isFocus = true
  page.setData({
    bottomToolbar: bottomToolbar
  })
}

/**
 * 获取底部评论输入框的值
 */
const commentTnput = (page, e) => {
  let bottomToolbar = page.data.bottomToolbar
  bottomToolbar.commentInfo = e.detail.value
  bottomToolbar.isFocus = true
  page.setData({
    bottomToolbar: bottomToolbar
  })
}

/**
 * 提交评论
 */
const addComment = (page, data) => {
  let commentInfo = page.data.bottomToolbar.commentInfo
  if (app.isNotNull(commentInfo)) {
    data.info = commentInfo
    app.request({
      url: 'comment/addComment.do',
      data: data,
      success: res => {
        let comment = page.data.comment
        comment.number = res.json.commentNumber
        comment.list = res.json.list
        let bottomToolbar = page.data.bottomToolbar
        bottomToolbar.commentInfo = ''
        bottomToolbar.isFocus = false
        page.setData({
          comment: comment,
          bottomToolbar: bottomToolbar
        }, () => {
          app.toast('评论成功')
        })
      }
    })
  }
}

/**
 * 收藏
 */
const addCollect = (page, data) => {
  app.request({
    url: 'collect/addCollect.do',
    data: data,
    success: res => {
      let bottomToolbar = page.data.bottomToolbar
      bottomToolbar.isCollect = true
      page.setData({
        bottomToolbar: bottomToolbar
      }, () => {
        app.toast('收藏成功')
      })
    }
  })
}

/**
 * 取消收藏
 */
const cancelCollect = (page, data) => {
  app.request({
    url: 'collect/cancelCollect.do',
    data: data,
    success: res => {
      let bottomToolbar = page.data.bottomToolbar
      bottomToolbar.isCollect = false
      page.setData({
        bottomToolbar: bottomToolbar
      }, () => {
        app.toast('取消收藏')
      })
    }
  })
}

/**
 * 点赞
 */
const addPraise = (page, data) => {
  app.request({
    url: 'praise/addPraise.do',
    data: data,
    success: res => {
      let bottomToolbar = page.data.bottomToolbar
      bottomToolbar.praiseNumber = res.json.praiseNumber
      bottomToolbar.isPraise = true
      page.setData({
        bottomToolbar: bottomToolbar
      })
    }
  })
}

/**
 * 取消赞
 */
const cancelPraise = (page, data) => {
  app.request({
    url: 'praise/cancelPraise.do',
    data: data,
    success: res => {
      let bottomToolbar = page.data.bottomToolbar
      bottomToolbar.praiseNumber = res.json.praiseNumber
      bottomToolbar.isPraise = false
      page.setData({
        bottomToolbar: bottomToolbar
      })
    }
  })
}

module.exports = {
  focusCommentInput: focusCommentInput,
  commentTnput: commentTnput,
  addComment: addComment,
  addCollect: addCollect,
  cancelCollect: cancelCollect,
  addPraise: addPraise,
  cancelPraise: cancelPraise
}