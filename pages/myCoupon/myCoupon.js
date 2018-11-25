// pages/myCoupon/myCoupon.js
import util from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myCoupon: [],
    noData:false,
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
    var that = this;
    util.ApiPost({
      loading:true,
      url:'api/user/myCard',
      _success:function(res){
        var list = res.data.list;
        list.forEach(function(item){
          item.expire_at = item.expire_at.substring(0, 10)
        })
        if(list.length==0){
          console.log(123);
          that.setData({
            noData:true,
          })
        }else{
          that.setData({
            myCoupon: list,
          })
        }
        console.log(res);
      },
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