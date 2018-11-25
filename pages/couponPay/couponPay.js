// pages/couponPay/couponPay.js
import util from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:'',
    balance:'',
    showDialog:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cardId = options.cardId;
    this.setData({
      cardId: cardId,
    })
    
  },
  selectPay:function(){
    this.setData({
      showDialog:true,
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
    var that = this;
    util.ApiPost({
      loading: true,
      url: 'api/user/cardDetail',
      data: {
        card_id: that.data.cardId,
      },
      _success: function (res) {
        var list = res.data;
        that.setData({
          list: list,
        })
      }
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