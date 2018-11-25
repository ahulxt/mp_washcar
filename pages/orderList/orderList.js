// pages/orderList/orderList.js
import util from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noData:false,
    orderList:[],
    currentPage:1,
    isBottomText:false,
    winHeight:'',
    bottomText:'',
    fullLoading:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var res = wx.getSystemInfoSync();
    that.setData({
      winHeight: res.windowHeight,
    });
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
    this.getList()
  },
  toOrderDetail:function(e){
    var order_id = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?order_id=' + order_id + '&status=' + status,
    })
  },
  getList: function (){
    var that = this;
    var loadingPage = that.data.currentPage;
    if (loadingPage > that.data.totalPage){
      return false;
    }
    util.ApiPost({
      loading: true,
      url: 'api/order/list',
      data:{
        page: loadingPage,
      },
      _success: function (res) {
        var totalPage = res.data.totalPage;
        that.setData({
          totalPage: totalPage,
        })
        if (totalPage == 0){
          that.setData({
            noData: true,
          })
        } else{
          if (totalPage > 1){
            that.setData({
              isBottomText: true,
              bottomText: '上拉加载更多'
            })
            if (loadingPage >= totalPage) {
              that.setData({
                isBottomText: true,
                bottomText: '已全部加载完毕！',
              })
            }
          }
          //var nextPage = currentList.concat(res.data.list)
          that.setData({
            orderList: res.data.list,
          })
        }
      },
    })
  },
  // 加载更多
  loadMore:function(){
    if(this.data.currentPage < this.data.totalPage){
      var nextPage = this.data.currentPage + 1;
      this.setData({
        currentPage: nextPage,
      })
      this.getList()
    }
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