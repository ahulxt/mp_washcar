// pages/orderDetail/orderDetail.js
import util from "../../utils/util";
const app = getApp()
var interval;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',
    detail_title:'',
    detail_data:'',
    progress_title: '',
    log_data:'',
    showDialog:false,
    countDownMinute: '--分',
    countDownSecond:'--秒',
    balance:0,
    total_value:0,
    showTop:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var order_id = options.order_id;
    that.setData({
      order_id: order_id,
    })
  },
  // 服务前后照片大图预览
  previewImg:function(e){
    var that = this;
    console.log(e);
    var imgList=[];
    var idx = e.currentTarget.dataset.value;
    var currentSrc = e.currentTarget.dataset.url;
    var images = that.data.log_data[idx].images.images
    images.forEach(function(value,index){
      imgList.push(value.src)
    })
    wx.previewImage({
      current: currentSrc,
      urls: imgList,
    })
  },
  // 呼叫擦车人员
  makePhoneCall:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.detail_data.washer_phone,
    })
  },
  // 修改订单状态
  changeOrder:function(e){
    console.log(e)
    var action = e.currentTarget.dataset.action;
    var text = e.currentTarget.dataset.text;
    var that = this;
    // 如果按钮为申请售后
    if (action == 'after_sale'){
      wx.makePhoneCall({
        phoneNumber: app.globalData.customerServicePhone,
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '是否确定' + text,
        success: function (res) {
          if (res.confirm) {
            util.ApiPost({
              loading: true,
              url: 'api/order/changeStatus',
              data: {
                
                order_id: that.data.order_id,
                action: action
              },
              _success: function () {
                wx.showToast({
                  title: '操作成功',
                  duration:1000,
                })
                setTimeout(function () { 
                  that.getOrderDetail()
                },1000)
              }
            })
          } else if (res.cancel) {

          }
        }
      })
    }
    
    
  },
 
  // 选择支付方式
  selectPay:function(){
    this.setData({
      showDialog: true,
    })
  },

 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderDetail();
  },
  
  // 获取订单详细数据
  getOrderDetail:function(){
    var that = this;
    util.ApiPost({
      loading: true,
      url: 'api/order/detail',
      data: {
        //order_id: '1808218721',
        order_id: that.data.order_id,
      },
      _success: function (res) {
        console.log(res);
        var detail = res.data.detail;
        var detail_data = detail.data;
        var log = res.data.log;
        var log_data = log.data;
        var balance = parseFloat(detail_data.balance);
        var totalValue = parseFloat(detail_data.total_value)
        that.setData({
          detail_data: detail_data,
          detail_title: detail.title,
          progress_title: log.title,
          log_data: log_data,
          balance: balance,
          total_value: totalValue,
          showTop: true,
        })
        
        //倒计时
        if (detail_data.cancel_left) {
          var diffTime = detail_data.cancel_left;
          if (diffTime > 0) {
            interval = setInterval(function () {
              var day = Math.floor(diffTime / 3600 / 24);
              var dayStr = day.toString();
              if (dayStr.length == 1) {
                dayStr = "0" + dayStr;
              }

              var hr = Math.floor((diffTime - day * 3600 * 24) / 3600)
              // console.log("小时数" +hr)
              var hrStr = hr.toString();
              if (hrStr.length == 1) {
                hrStr = "0" + hrStr;
              }

              // 分钟位 
              var min = Math.floor((diffTime - day * 3600 * 24 - hr * 3600) / 60);
              // console.log("分钟数" + min)
              var minStr = min.toString();
              if (minStr.length == 1) {
                minStr = '0' + minStr;
              }

              // 秒位 
              var sec = diffTime - day * 3600 * 24 - hr * 3600 - min * 60;
              // console.log("秒数" + sec)
              var secStr = sec.toString();
              if (secStr.length == 1) {
                secStr = '0' + secStr;
              }
              if (diffTime <= 0) {
                util.ApiPost({
                  loading: true,
                  url: 'api/order/detail',
                  data: {
                    order_id: that.data.order_id,
                  },
                  _success: function (res) {
                    var detail = res.data.detail;
                    var detail_data = detail.data;
                    var log = res.data.log;
                    var log_data = log.data;
                    that.setData({
                      detail_data: detail_data,
                      progress_title: log.title,
                      log_data: log_data,
                      
                    })
                  }
                })
                clearInterval(interval)
              }
              that.setData({
                countDownDay: day >= 1 ? dayStr + '天' : '',
                countDownHour: hr >= 1 ? hrStr + '时' : '',
                countDownMinute: min >= 1 ? minStr + '分' : '',
                countDownSecond: sec >= 0 ? secStr + '秒' : ''
              })
              diffTime--;
            }, 1000)
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})