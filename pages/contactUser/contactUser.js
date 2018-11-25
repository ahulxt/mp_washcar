// pages/contactUser/contactUser.js
import util from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submit: true,
    name:'',
    tel:'',
    // isNameFocus:false,
    // isTelFocus:false,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var contactUser = options.contactUser;
    var contactPhone = options.contactPhone;
    if (contactUser && contactPhone ){
      this.setData({
        name: contactUser,
        tel: contactPhone,
      })
    }
    
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
    if(this.data.name && this.data.tel){
      this.showSubmit();
    }
  },
  inputName: function (e) { 
    var that = this;
    that.setData({
      name: e.detail.value
    })
    that.showSubmit();

  },
  inputTel:function(e){
    var that = this;
    that.setData({
      tel: e.detail.value
    })
    that.showSubmit();
  },
  // clear:function(e){
  //   console.log(e)
  //   if(e.target.id == 'name'){
  //     this.setData({
  //       //isNameFocus: true,
  //       name: '',
  //     })
  //   } else if (e.target.id == 'tel'){
  //     this.setData({
  //       //isTelFocus: true,
  //       tel: '',
  //     })
  //   }
    
  // },
  showSubmit:function(){
    var that = this;
    if (that.data.name && (that.data.tel.length == 11)) {
      that.setData({
        submit: false,
      })
    }
    if (!that.data.name || that.data.tel.length !== 11) {
      that.setData({
        submit: true,
      })
    }
  },
  validate:function(){
    var that = this;
    var telreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if(!that.data.name){
      wx.showToast({
        title: '联系人姓名不能为空！',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if (!telreg.test(that.data.tel)){
      wx.showToast({
        title: '请输入正确的电话号码！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
  },
  submitContactUser:function(e){
    var that = this;
    that.validate();
    util.setPrevPageData({
      contact_user: that.data.name.trim(),
      contact_phone: that.data.tel.trim(),
      contactInfo: that.data.name.trim() + ' ' + that.data.tel.trim()
    })
    wx.navigateBack({
      delta: 1,
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