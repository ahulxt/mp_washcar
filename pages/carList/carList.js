// pages/car/carList.js
import util from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX:'',
    startY:'',
    carList:'',
    isArrow:true,
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
      loading: true,
      url: 'api/car/myCar',
      _success: function (res) {
        var carList = res.data.list
        that.setData({
          carList: carList
        })
      },
      _fail: function (err) {
        console.log(err);
      }
    })
  },
  chooseCarBrand: function () {
    wx.navigateTo({
      url: '../carInfo/carInfo',
    })
  },
  selectCar: function (e) {
    util.setPrevPageData({
      carInfo: e.currentTarget.dataset.value,
      car_id: e.currentTarget.dataset.id,
    })

    wx.navigateBack({
      delta: 1,
    })
  },
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.carList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      carList: this.data.carList
    })

  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });

    that.data.carList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true;
      }
    })
    //更新数据
    that.setData({
      carList: that.data.carList
    })
  },
  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var that = this;
    util.ApiPost({
      loading: true,
      url: 'api/car/delete',
      data: {
        car_id: e.currentTarget.dataset.id
      },
      _success: function (res) {
        that.data.carList.splice(e.currentTarget.dataset.index, 1)
        that.setData({
          carList: that.data.carList
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