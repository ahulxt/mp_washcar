// pages/login/login.js
import util from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneValue:'',
    codeValue:'',
    disabled:false,
    codeName:'获取验证码',
    submit:true,
  },
  getPhoneValue:function(e){
    this.setData({
      phoneValue:e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      codeValue: e.detail.value
    })
    if (this.data.phoneValue && this.data.codeValue.length == 6) {
      this.setData({
        submit: false,
      })
    }
  },
  getCode:function(){
    var tel = this.data.phoneValue;
    var telreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    var that = this;
    if (tel == ''){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (!telreg.test(tel)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }else{
      util.ApiPost({
        url: 'api/tool/sendSMSCode',
        data: {
          phone: tel,
          use_type: 'login_by_phone'
        },
        _success:function(res){
          console.log(res);
          var num = 60;
          var timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              that.setData({
                codeName: '重新发送',
                disabled: false,
              })
            } else {
              that.setData({
                disabled: true,
                codeName: num + 's后重新发送'
              })
            }
          }, 1000)
        },
      })
    }
    
  },
  getVerificationCode:function(){
    this.getCode();
    var that = this;
    that.setData({
      disabled: false
    })
  },
  login:function(){
    var tel = this.data.phoneValue;
    var code = this.data.codeValue;
    var telreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    var that = this;
    if (tel == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (!telreg.test(tel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    util.ApiPost({
      url: 'api/user/loginByPhone',
      data: {
        account: this.data.phoneValue,
        verify_code: this.data.codeValue,
      },
      _success:function(res){
        console.log(res)
        wx.setStorageSync('token', res.data.token)
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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