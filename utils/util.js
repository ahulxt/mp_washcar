var md5 = require('md5.js')
const damain = 'https://www.yexingxia2018.com/';
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

//函数节流
function throttle(method, delay, duration) {
  var timer = null, begin = new Date();

  return function () {
    var context = this, args = arguments, current = new Date();
    clearTimeout(timer);

    if (current - begin >= duration) {
      method.apply(context, args);
      begin = current;
    } else {
      timer = setTimeout(function () {
        method.apply(context, args);
      }, delay);
    }
  }
}
function base64_encode(str) { // 编码，配合encodeURIComponent使用
  var c1, c2, c3;
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var i = 0, len = str.length, strin = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
      strin += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
      strin += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    strin += base64EncodeChars.charAt(c1 >> 2);
    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    strin += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return strin
}


//loading, url, params, success, fail
//封装请求
function ApiPost(obj){
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route
  if(!obj.hasOwnProperty('loading')){
    obj.loading = false
  }
  if (!obj.hasOwnProperty('data')) {
    obj.data = {}
  }
  if (obj.loading == true){
    wx.showLoading({
      title: '数据加载中',
    })
  }
  // 签名
  var keyArr = [];
  for(var x in obj.data) {
    keyArr.push(x);
  }
  keyArr.sort();
  var stringArr = [];
  keyArr.forEach(function(v,i){
    stringArr.push(v + '=' + obj.data[v])
  })
  var dataString = stringArr.join('&');
  obj.data.sign = md5.md5(dataString);
  wx.request({
    url: damain + obj.url,
    header:{
      token:wx.getStorageSync('token'),
      vfrom:'mp',
    },
    data: obj.data,
    method:'POST',
    success:function(res){
      if(obj.loading == true){
        wx.hideLoading();
      }
      if (res.data.code == 0){
        console.log(123);
        obj._success(res.data)
      }else{
        if (res.header.login == 0 && url !== 'pages/login/login') {
          if (wx.getStorageSync('token')) {
            wx.removeStorageSync('token');
          }
          if (url == 'pages/index/index') {
            return false;
          } else {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
        else{
          if (res.data.error) {
            wx.showToast({
              title: res.data.error,
              icon: 'none',
              duration: 2000
            })
            return;
          }
        }
      }
    },
    fail:function(err){
      if (obj.loading == true) {
        wx.hideLoading();
      }
      obj._fail(err);
    }
  })
}
//封装子页面向父页面传数据
function setPrevPageData(params){
  var that = this;
  var pages = getCurrentPages();
  var currentPage = pages[pages.length - 1]; //当前页面
  var prevPage = pages[pages.length - 2]; //上一个页面
  prevPage.setData(params)
}

module.exports = {
  formatTime: formatTime,
  throttle: throttle,
  ApiPost: ApiPost,
  setPrevPageData:setPrevPageData,
}
