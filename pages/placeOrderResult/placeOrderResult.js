// pages/placeOrderResult/placeOrderResult.js
import util from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:'',
    payment_status:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id:options.order_id
    })
    var payment_status = options.payment_status;
    if (payment_status == 1){
      this.setData({
        payment_status: payment_status,
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
  
  },
  toOrderList:function(){
    var order_id = this.data.order_id;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?order_id=' + order_id,
    })
  },
  toCancelOrder:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定取消该订单',
      success: function (res) {
        if (res.confirm) {
          util.ApiPost({
            loading:true,
            url: 'api/order/changeStatus',
            data: {
              order_id: that.data.order_id,
              action: 'cancel_order'
            },
            _success: function () {
              that.toOrderList()
            }
          })
        } else if (res.cancel) {

        }
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