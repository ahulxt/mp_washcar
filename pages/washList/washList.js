// pages/washList/washList.js
import util from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    washList:{},
    wash_product_id:'',
    //wash_product_name:'',
    //total:'',
    //totalOri:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wash_product_id = options.wash_product_id;
    this.setData({
      wash_product_id: wash_product_id,
    })
    var that = this;
    util.ApiPost({
      loading:true,
      url:'api/order/washList',
      _success:function(res){
        that.setData({
          washList:res.data.list
        })
      }
    })
  },
  
  radioChange:function(e){
    var washId = e.detail.value;
    // this.setData({
    //   wash_product_id: washId,
    // })
    util.setPrevPageData({
      wash_product_id: washId,
    })
  },
  radioTap: function (e) {
    var washName = e.currentTarget.dataset.name;
    var price = e.currentTarget.dataset.price;
    var oriprice = e.currentTarget.dataset.oriprice;
    // this.setData({
    //   wash_product_name: washName,
    //   total: price,
    //   totalOri: oriprice,
    // })
    util.setPrevPageData({
      wash_product_name: washName,
      total: price,
      totalOri: oriprice,
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  toDetail:function(e){
    var washId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/washDetail/washDetail?id=' + washId,
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