// pages/recharge/recharge.js
import util from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked:false,
    currentAmount:100,
    payType:'recharge',
    method:'wechat',
    balance:'',
    amountList:[
      {
        value: 20,
        checked:false
      },
      {
        value: 50,
        checked: false
      },
      {
        value: 100,
        checked: true
      },
      {
        value: 200,
        checked: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      balance: options.balance,
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
  
  },
  
  radioChange: function (e) {
    this.setData({
      currentAmount:e.detail.value
    })
  },
  recharge: function () {
    var that = this;
    if (that.data.method !== undefined) {
      var openid = wx.getStorageSync('openid');
      util.ApiPost({
        loading: true,
        url: 'api/tool/pay',
        data: {
          openid: openid,
          key_id: that.data.currentAmount,
          pay_type: that.data.payType,
          payment_method: that.data.method,
        },
        _success: function (res) {
          var data = res.data;
          var paySign = data.paySign;
          console.log(paySign)
          if (paySign && paySign !== undefined) {
            var payObj = {
              appId: data.appid,
              timeStamp: data.timestamp,
              nonceStr: data.nonce_str,
              package: 'prepay_id=' + data.prepay_id,
              signType: 'MD5',
              paySign: paySign,
              success(res) {
                wx.navigateBack({
                  delta:1,
                })
                console.log('支付成功');
                console.log(res);
              },
              fail(res) {
                //支付失败，取消支付
                console.log('支付失败');
                console.log(res);
              }
            };
            wx.requestPayment(payObj)
          } else {
            //console.log('meiy')
          }
          

        }
      })
    } 
  },
  toAgreement:function(){
    wx.navigateTo({
      url: '/pages/webview/webview?linkurl=https://www.yexingxia2018.com/article/57',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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