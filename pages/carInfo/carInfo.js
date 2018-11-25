// pages/carInfo/carInfo.js
import util from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isKeyboard: false,//是否显示键盘
    keyboardValue: ['京','沪','浙','苏','粤','鲁','晋','冀','豫','川','渝','辽','吉','黑','皖','鄂','津','贵','云','桂','琼','青','新','藏','蒙','宁','甘','陕','闽','赣','湘'],
    textValue:'',
    textValue2:'',
    currentProv:'',
    showcolor:false,
    colorList:'',
    currentColorId:-1,
    currentColorName:'',
    showDrawerFlag:false
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
    var that = this;
    //加载省份接口
    // util.ApiPost({
    //   url: 'api/car/province',
    //   _success:function(res){
    //     var provinceArr = []
    //     var province = res.data.list
    //     province.forEach(function (value) {
    //       provinceArr.push(value.name)
    //     })
    //     that.setData({
    //       keyboard1: provinceArr,
    //       keyboardValue: provinceArr
    //     })
    //   },
    //   _fail:function(err){
    //     console.log(err)
    //   }
    // });
    

    //加载颜色接口
    util.ApiPost({
      url: 'api/car/color',
      _success:function(res){
        that.setData({
          colorList: res.data.list
        })
      },
      _fail:function(err){
        console.log(err)
      },
    })
  },
  selectCarBrand:function(){
    wx.navigateTo({
      url: '/pages/carBrand/carBrand',
    })
  },
  selectCarNumber:function(){
    var that = this;
    if (that.data.isKeyboard){
      that.setData({
        isKeyboard: false,
        showDrawerFlag: false,
      })
    }else{
      that.setData({
        isKeyboard: true,
        showDrawerFlag: true,
      })
    }
    
  },
  tapKeyboard:function(e){
    var that = this;
    var tapVal = e.target.dataset.value;
    that.setData({
      textValue: tapVal,
      isKeyboard: false,
      showDrawerFlag: false,
    })

  },
  tapCarColor:function(e){
    var that = this;
    var currentColorId = e.target.dataset.id;
    var currentColorName = e.target.dataset.name;
    that.setData({
      currentColorId : currentColorId,
      currentColorName: currentColorName,
      showcolor:false,
      showDrawerFlag: false,
    })
  },
  inputCarBrand:function(e){
    this.setData({
      textValue2:e.detail.value,
    })
  },
  selectCarColor:function(){
    var that = this;
    if (that.data.showcolor) {
      that.setData({
        showDrawerFlag:false,
        showcolor: false
      })
    } else {
      that.setData({
        showDrawerFlag:true,
        showcolor: true
      })
    }
  },
  hideSelect:function(){
    var that = this;
    that.setData({
      showDrawerFlag: false,
      isKeyboard:false,
      showcolor:false,
    })
  },
  submitCaiInfo:function(){
    var that = this;
    var carReg = /^[A-Za-z][A-Za-z0-9]{5,6}$/;
    if (that.data.carBrand == '') {
      wx.showToast({
        title: '请选择车型',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return false;
    }
    if(!that.data.textValue){
      wx.showToast({
        title: '请选择车牌号所在区域',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return false;
    }
    if (!carReg.test(that.data.textValue2)){
      wx.showToast({
        title: '请输入正确的车牌号码',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return false;
    }
    if (that.data.currentColorName == '') {
      wx.showToast({
        title: '请选择颜色',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return false;
    }
   
    util.ApiPost({
      url:'api/car/save',
      data: {
        brand_id: that.data.brandId,
        model_id: that.data.modelId,
        plate_number: that.data.textValue + that.data.textValue2,
        color_id: that.data.currentColorId,
      },
      _success:function(res){
        wx.navigateBack({
          delta:1
        })
      }
    })
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