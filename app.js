App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {


    wx.login({
      success: res => {
        // wx.login 登录success之后
        this.getOpenIdByLogin(res);
        /*取数，如果购物车为空则，清空购物车显示*/
        wx.removeStorageSync("cartProNum");
      }
    })

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },

  //===========================自定义对象，服务对象属性
  server: {
    userId: "testId",
    openId: "",
    session_key: "",
    getopenIdUrl: 'https://www.myyd.xyz/baasmypay/mypay/api/login',
    createOrderUrl: 'https://www.myyd.xyz/baasmypay/mypay/api/createOrder',
    wxPaymentUrl: 'https://www.myyd.xyz/baasmypay/mypay/api/payment',
    buyCartUrl: '?',//选择要买商品（勾选）负责计算商品总价
    ceshiUrlUrl: 'https://www.myyd.xyz/baas/tt/Order/index',//订单编号号
    PaySuccessCallUrl: '/pages/mypay/mypay'
  },
  //=============================自定义函数
  getOpenIdByLogin: function (res) {
    var that = this;
    wx.request({
      url: that.server.getopenIdUrl,
      data: {
        code: res.code
      }, success: function (res) {
        that.server.openId = res.data.openid;
        that.server.session_key = res.data.session_key;
        console.log(that.server.openId)
        console.log(that.server.session_key)
      }
    })
  },

  //==================================================================
  //自定义函数 ,入口：createProductOrderByServerOpenId
  //参数：
  createProductOrderByServerOpenId: function (url, openId, price, body) {
    //创建订单
    var that = this;
    wx.request({
      url: url,
      method: 'get',
      data: {
        'openId': openId,
        'price': price,
        'body': body
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        console.log("1、服务器返回订单信息如下");
        console.log(res.data);
        //微信支付
        that.wxpay(data);
      },
      fail: function (e) {
        console.log(app.server.appId);
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },

  //调起微信支付
  wxpay: function (order) {
    
    wx.setStorageSync("orderId", order.orderId);

    console.log("调起微信支付");
    let that = this;
    wx.request({
      url: that.server.wxPaymentUrl,
      method: 'post',
      data: {
        orderId: order.orderId,
        userId: that.server.userId,
        nonceStr: order.nonceStr,
        prepayId: order.package,
      },
      // header: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,

            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: that.server.PaySuccessCallUrl,
                });
              }, 2500);

              
            },

            fail: function (res) {
              console.log("wx.requestPayment失败");
              console.info(res);
              wx.showToast({
                title: res.err_desc,
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  }
  //=======================================================================
})
