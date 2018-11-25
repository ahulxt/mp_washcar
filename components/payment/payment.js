import util from "../../utils/util";
Component({
  properties: {
    keyId:{
      type:String,
      value:'',
    },
    payType:{
      type: String,
      value: '',
    },
    balance:{
      type:Number,
      value:0,
      observer: function () {
        this.choosePayment();
      }
    },
    totalValue: {
      type: Number,
      value: 0,
      observer: function () {
        this.choosePayment();
      }
    },
    showDialog:{
      type:Boolean,
      value:false,
    }
  },
  data: {
    isCheckbox: false,
    method: '',
    diffCount: 0,
    isWechatRadio: false,
    isBalanceRadio: false,
  },
  ready: function () {
    
  },
  methods: {
    choosePayment:function(){
      var that = this;
      var balance = parseFloat(that.data.balance);
      var totalValue = parseFloat(that.data.totalValue);
      //console.log('balance:' + balance + ',totalValue=' + totalValue)
      if (0 < balance && balance < totalValue) {
        // 余额不足，选择组合支付
        that.setData({
          isCheckbox: true,
          method: 'wechat,balance',
          diffCount: (totalValue * 100 - balance * 100)/100
        })
      } else if (balance >= totalValue) {
        // 余额大于订单金额，默认选中余额
        that.setData({
          isBalanceRadio: true,
          isCheckbox: false,
          method: 'balance'
        })
      } else {
        //余额<=0时，只能选微信
        that.setData({
          isCheckbox: false,
          isWechatRadio: true,
          method: 'wechat'
        })
      }
    },

    // 支付
    pay: function () {
      var that = this;
      that.hideDrawer();
      if (that.data.method !== undefined) {
        var openid = wx.getStorageSync('openid');
        util.ApiPost({
          loading: true,
          url: 'api/tool/pay',
          data:{
            openid: openid,
            key_id: that.data.keyId,
            pay_type: that.data.payType,
            payment_method: that.data.method,
          },
          _success:function(res){
            var url = '';
            if (that.data.payType == 'card') {
              url = '/pages/myCoupon/myCoupon'
            } else if (that.data.payType == 'order') {
              url = '/pages/placeOrderResult/placeOrderResult?order_id=' + that.data.keyId;
            }
            if (that.data.method == 'balance'){
              wx.showToast({
                title: '支付成功',
                icon:'success',
                duration:1000
              })
              setTimeout(function(){
                wx.navigateTo({
                  url: url,
                })
              },1000)
            }else{
              var data = res.data;
              var paySign = data.paySign;
              //console.log(paySign)
              if (paySign && paySign !== undefined) {
                var payObj = {
                  appId: data.appid,
                  timeStamp: data.timestamp,
                  nonceStr: data.nonce_str,
                  package: 'prepay_id=' + data.prepay_id,
                  signType: 'MD5',
                  paySign: paySign,
                  success(res) {
                    wx.navigateTo({
                      url: url,
                    })
                    console.log('支付成功');
                    console.log(res);
                  },
                  fail(res) {
                    //支付失败，取消支付
                    console.log('支付失败');
                    console.log(res);
                  }
                };
                wx.requestPayment(payObj)
              } else {
                //console.log('meiy')
              }
            }
            
          }
        })
        
        /*
        util.ApiPost({
          loading: true,
          url: 'api/order/pay',
          data: {
            //order_id: '1808218721',
            order_id: that.data.orderId,
            payment_method: that.data.method,
          },
          _success: function (res) {
            console.log(res);

            wx.navigateTo({
              url: '/pages/placeOrderResult/placeOrderResult?order_id=' + that.data.orderId,
            })
          }
        })
        */
      } else {
        wx.showToast({
          title: '请选择支付方式',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
    },
    hideDrawer: function () {
      this.setData({
        showDialog: false,
      })
    },
    // 余额足够-支付方式单选
    select: function (e) {
      var slectedValue = e.detail.value;
      this.setData({
        slectedValue: slectedValue,
        method: slectedValue,
      })
      //console.log(this.data.method)
    },
    // 余额不足，支付方式复选
    multiSelect: function (e) {
      var slectedValue = e.detail.value;
      this.setData({
        slectedValue: slectedValue,
        method: slectedValue.join(','),
      })
      console.log(this.data.method);
    },
  }
})