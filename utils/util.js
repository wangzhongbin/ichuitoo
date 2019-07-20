const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const trim = value => {
  value = value.replace(/^\s+|\s+$/g, '');
  return value = value.replace(/\s+/g, '');
}

const isNotNull = value => {
  if (value == undefined || value == null || value == '') {
    return false;
  }
  return true;
}

const showModal = str => {
  wx.showModal({
    title: '提示',
    showCancel: false,
    confirmColor: '#d81e06',
    content: str
  })
}

const showToast = (str, icon) => {
  wx.showToast({
    icon: icon,
    title: str,
    duration: 1500
  })
}

const randomNum = (minNum, maxNum) => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}

const isInArray = (arr, value) => {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}

const isFunction = obj => {
  return typeof obj === 'function'
}

module.exports = {
  formatTime: formatTime,
  trim: trim,
  isNotNull: isNotNull,
  showModal: showModal,
  showToast: showToast,
  randomNum: randomNum,
  isInArray: isInArray,
  isFunction: isFunction
}