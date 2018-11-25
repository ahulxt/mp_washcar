// pages/index/index.js
import util from "../../utils/util";
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const app = getApp()
var drawerW;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    car_id:'',
    carInfo:'',
    contact_user:'',
    contact_phone:'',
    contactLast:'',
    contactInfo:'',
    serviceList:'',
    serviceListIndex:'',
    serviceTimeList:'',
    serviceTimeIndex:'',
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 600,
    circular:true,
    imgUrls:'',
    address:'',
    contactUser:'',
    contactPhone:'',
    detailAddress:'',
    address_coordinate:'',
    isServiceList:true,
    showDrawerFlag: false,
    userInfo:'',
    currentLatitude:'',
    currentLongitude:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var serviceList = [];
    var res = wx.getSystemInfoSync();
    
    that.setData({
      winHeight: res.windowHeight,
      winWidth: res.windowWidth,
    });
    
  },
  // 首页检查登录状态
  checkLogin: function (callback) {
    var that = this;
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      if (callback) {
        callback();
      }
    }
  },
  chooseCar:function(){
    var that = this;
    that.checkLogin(function(){
      wx.navigateTo({
        url: '/pages/carList/carList',
      })
    });
    
  },
  chooseAdress:function(){
    var that = this;
    that.checkLogin(function(){
      wx.getSetting({
        success:function(res){
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success(res) {
                wx.chooseLocation({
                  success: function (res) {
                    that.setData({
                      address: res.name,
                      address_coordinate: res.latitude + ',' + res.longitude
                    })
                  },
                  
                })
              },
              fail: function (err) {
                wx.showModal({
                  title: '用户未授权',
                  content: '允许"洗车"使用您的定位，以获取准确的订单信息',
                  showCancel:false,
                  success:function(res){
                    if(res.confirm){
                      wx.openSetting({})
                    }
                  }
                })
              }
            })
          }else{
            wx.chooseLocation({
              success: function (res) {
                that.setData({
                  address: res.name,
                  address_coordinate: res.latitude + ',' + res.longitude
                })
                //console.log(that.data.address_coordinate);
              },
            })
          }
        }
        
      })
      
      
    })
    
  },
  selectService:function(){
    var that = this;
    that.checkLogin(function(){
      wx.navigateTo({
        url: '/pages/washList/washList?wash_product_id=' + that.data.wash_product_id,
      })
    })
    
  },
  selectWashTime:function(){
    this.checkLogin()
    
  },
  // 选择联系人
  selectContactUser: function () {
    var that = this;
    var contactUser, contactPhone, contactUrl;
    that.checkLogin(function(){
      if (that.data.contact_user !== '' && that.data.contact_phone!==''){
        contactUser = that.data.contact_user;
        contactPhone = that.data.contact_phone;
        contactUrl = '/pages/contactUser/contactUser?contactUser=' + contactUser + '&contactPhone=' + contactPhone
      }else{
        contactUrl = '/pages/contactUser/contactUser'
      }
      wx.navigateTo({
        url: contactUrl
      })
    })
    
  },
  bindDetailAddress: function () {
    this.checkLogin();
  },
  inputDetailAddress:function(e){
    this.setData({
      detailAddress:e.detail.value,
    })
  },
  showSideBar:function(){
    var that = this;
    that.checkLogin(function(){
      that.setData({
        showDialog: true,
      })
    })
    
  },
  //隐藏侧边二级菜单列表
  hideDrawer:function () {
    this.setData({
      showDialog: false,
    })
  },
  
  // 跳转至我的订单
  toOrderList:function(){
    wx.navigateTo({
      url: '/pages/orderList/orderList',
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
    //创建动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    });
    that.animation = animation;
    util.ApiPost({
      loading: true,
      url: 'api/order/index',
      _success: function (res) {
        that.setData({
          imgUrls: res.data.banners,
          userInfo: res.data.userInfo,
          serviceTimeList: res.data.washTimeList,
          isServiceList:false,
        })
        if (res.data.contact.user !== '' && res.data.contact.phone !== '' && that.data.contactInfo == '') {
          that.setData({
            contact_user: res.data.contact.user,
            contact_phone: res.data.contact.phone,
            contactInfo: res.data.contact.user + ' ' + res.data.contact.phone
          })
        }
      }
    })
   
    // 获取位置权限
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              that.getAdress()
            },
            fail: function (err) {
              wx.showModal({
                title: '用户未授权',
                content: '允许"洗车"使用您的定位，以获取准确的订单信息',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({})
                  }
                }
              })
            }
          })
        } else {
          that.getAdress()
        }
      }

    })
    
    
  },
  // 首页自动加载地址
  getAdress:function(){
    var that = this;
    var qqmapsdk = new QQMapWX({
      key: 'TBFBZ-R5RKI-S3ZGR-5SE4O-F5PPT-4GFHQ'
    });
    wx.getLocation({
      success: function (res) {
        that.setData({
          address_coordinate: res.latitude + ',' + res.longitude
        })
        if (that.data.address == '') {
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (addressRes) {
              var address = addressRes.result.formatted_addresses.recommend;
              that.setData({
                address: address,
              })
            }
          })
        }

      }
    })
    
  },
  //选择清洗时间
  bindServiceTimeChange: function (e) {
    
    var serviceTimeIndex = e.detail.value;
    this.setData({
      serviceTimeIndex: e.detail.value,
      wash_time: this.data.serviceTimeList[serviceTimeIndex].value
    })
  },
  // 下单
  placeOrder:function(e){
    var formId = e.detail.formId;
    var openid = wx.getStorageSync('openid')
    var that = this;
    util.ApiPost({
      loading:true,
      url:'api/order/placeOrder',
      data:{
        form_id: formId,
        openid: openid,
        wash_product_id: that.data.wash_product_id,
        car_id: that.data.car_id,
        address: that.data.address + that.data.detailAddress,
        address_coordinate: that.data.address_coordinate,
        contact_user: that.data.contact_user,
        contact_phone: that.data.contact_phone,
        wash_time: that.data.wash_time,
      },
      _success:function(res){
        var order_id = res.data.order_id;
        var payment_status = res.data.payment_status;
        if (payment_status == 1) {
          wx.navigateTo({
            url: '/pages/placeOrderResult/placeOrderResult?payment_status=' + payment_status + '&order_id=' + order_id,
          })
        } else {
          wx.navigateTo({
            url: '/pages/orderDetail/orderDetail?order_id=' + order_id,
          })
        }
        that.setData({
          wash_product_id: '',
          wash_product_name: '',
          serviceTimeIndex: -1,
          contactInfo: '',
          address: '',
          detailAddress: '',
          carInfo: '',
        })
      }
    })
  },
  // 跳转至设置页面
  toSetting:function(){
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },
  // 跳转至充值页面
  toRecharge:function(){
    this.checkLogin(function () {
      wx.navigateTo({
        url: '/pages/couponList/couponList',
      })
    })
    
  },
  // banner图片跳转链接
  toLinkPage:function(e){
    var that = this;
    that.checkLogin(function(){
      var linkurl = e.currentTarget.dataset.link;
      wx.navigateTo({
        url: '/pages/webview/webview?linkurl=' + linkurl,
      })
    })
    
  },
  // 联系客服
  makePhoneCall:function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.customerServicePhone,
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