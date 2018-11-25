// pages/couponList/couponList.js
import util from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPop:false,
    washCardsList:'',
    currentTarget:'',
    balance:'',
    winHeight:'',
    winWidth:'',
    Hoffset:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync();
    this.setData({
      winHeight: res.windowHeight,
      winWidth:res.windowWidth,
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
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: "ease",
      delay: 0
    });
    this.animation = animation;
    util.ApiPost({
      loading:true,
      url:'api/user/wallet',
      _success:function(res){
        console.log(res);
        that.setData({
          washCardsList: res.data.washCards,
          balance: res.data.balance,
        })
      }
    })
  },
  toCouponDetail:function(e){
    var cardId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/couponPay/couponPay?cardId=' + cardId,
    })
    
  },
  toMyCoupon: function () {
    wx.navigateTo({
      url: '/pages/myCoupon/myCoupon',
    })
  },
  showPop:function(e){
    var that = this;
    var washCardId = e.currentTarget.dataset.id
    var washCardIndex = e.currentTarget.dataset.index
    this.setData({
      showPop: true,
      currentTarget: this.data.washCardsList[washCardIndex]
    })
    var bsliderHeight;
    var query = wx.createSelectorQuery();
    query.select('.popup').boundingClientRect().exec(function (res) {
      bsliderHeight = res[0].height;
      that.setData({
        bsliderHeight: bsliderHeight,
      })
      var Hoffset = that.data.winHeight / 2 + bsliderHeight/2
      that.animation.translateY(Hoffset).step();
      that.setData({
        Hoffset: Hoffset,
        animationData: that.animation.export()
      })
    });
    
  },
  hideDrawer: function () {
    var that = this;
    that.setData({
      showPop: false,
    })
    var Hoffset = that.data.Hoffset;
    that.animation.translateY(-Hoffset).step();
    that.setData({
      animationData: that.animation.export()
    })
  },
  toRecharge:function(){
    wx.navigateTo({
      url: '/pages/recharge/recharge?balance='+this.data.balance,
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