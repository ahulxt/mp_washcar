// pages/carBrand/carBrand.js
import util from "../../utils/util"
var timer;
var drawerW;
Page({
  data: {
    winHeight: '',
    toView:'',
    scrollTop:0,
    brandData:{},
    letterList:[],
    showLetterTip:false,
    showDialog:false,
    carSeries:'',
    animationData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var res = wx.getSystemInfoSync();
    that.setData({
      winHeight: res.windowHeight,
      winWidth: res.windowWidth,
      pixelRatio: res.pixelRatio,
      scrollYFlag: true
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中'
    });
    var that = this;

    //请求一级车牌数据
    util.ApiPost({
      loading:true,
      url: 'api/car/brand',
      _success:function(res){
        var results = res.data;
        var letterList = [];
        for (var key in results) {
          if (key == 'hot') {
            letterList.push('hot')
          } else {
            for (var index in results[key]) {
              letterList.push(results[key][index].title);
            }
          }
        }
        that.setData({
          brandData: results,
          letterList: letterList
        })
      },
      _fail:function(err){
        console.log(err)
      }
    })
    
  },
  //点击字母列表滚动到相应位置
  clickLetter: function (event) {
    var that = this;
    that.stopTimeCount();
    var currentLetter = event.target.dataset.letter;
    that.setData({
      selected: event.target.dataset.current,
      toView: currentLetter,
    })
    that.hideLetterTip();
  },
  //滑动字母列表，滚动到相应位置
  touchMove: function (e) {
    var that = this;
    var _cX = e.touches[0].clientX;
    var _length = that.data.brandData.all.length;
    var _winH = that.data.winHeight;
    var _cY = e.touches[0].clientY - (_winH - 20 * _length) / 2;  //移动的距离
    var tem = '';
    var selected = '';
    var _letterIndex = parseInt(_cY / 20); //0 1 2 3  移动到第几个字母
    tem = that.data.letterList[_letterIndex];
    selected = _letterIndex;
    util.throttle(function () {
      that.setData({
        toView: tem,
        selected: selected
      });
    }(), 200)
  },
  touchEnd: function () {
    this.hideLetterTip();
  },
  //隐藏字母放大提示
  hideLetterTip:function(){
    var that = this;
    timer = setTimeout(function(){
      that.setData({
        selected: -1
      })
    },400)
  },
  //清空字母放大提示动画
  stopTimeCount:function(){
    clearTimeout(timer)
  },
  //显示二级车型列表
  showDrawer:function(e){
    var that = this;
    var carBrandId = e.target.dataset.id;
    var carBrandName = e.target.dataset.name;
    util.ApiPost({
      url: 'api/car/model',
      data:{
        brand_id: carBrandId
      },
      _success:function(res){
        var carSeries = res.data.list;
        that.setData({
          brandId: carBrandId,
          showDialog: true,
          carSeries: carSeries,
          carBrandName: carBrandName
        })
        
      },
      _fail:function(err){
        console.log(res)
      },
    })

  },
  //隐藏侧边二级菜单列表
  hideDrawer:function(){
    this.setData({
      showDialog: false,
    })
  },
  seletCarSeries:function(e){

    // var pages = getCurrentPages();
    // var currentPage = pages[pages.length - 1]; //当前页面
    // var prevPage = pages[pages.length - 2]; //上一个页面
    // var that = this;
    // var modelId = e.target.dataset.id;
    // var carSeriesName = e.target.dataset.name == '暂无数据' ? '' : e.target.dataset.name;
    // that.setData({
    //   carSeriesName: carSeriesName
    // })
    // var data = that.data.carBrandName + ' ' + that.data.carSeriesName
    // prevPage.setData({
    //   brandId : that.data.brandId,
    //   modelId: modelId,
    //   carBrand: data
    // })
    var that = this;
    var carname = (e.target.dataset.name == '暂无数据') ? '' : e.target.dataset.name;
    var data = that.data.carBrandName + ' ' + carname
    var modelId = e.target.dataset.id;
    util.setPrevPageData({
      carSeriesName: carname,
      brandId: that.data.brandId,
      modelId: modelId,
      carBrand: data
    })
    wx.navigateBack({
      delta: 1,
    })

    // wx.navigateBack({
    //   delta: 1,
    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    //创建动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    });
    this.animation = animation;
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