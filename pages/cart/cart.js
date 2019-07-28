// pages/cart/cart.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    selectItems: [],
    // 全选的状态
    selectAll: true,
    // 总价
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (wx.getStorageSync("newItem") != 'isNull') {

      let CartHave = false;

      for (let i = 0; i < this.data.selectItems.length; i++) {
        if (wx.getStorageSync("newItem").productID == this.data.selectItems[i].productID) {
          CartHave = true;
          break;
        }
      }

      if (!CartHave) {
        this.data.selectItems.push(wx.getStorageSync("newItem"));
        this.setData({
          selectItems: this.data.selectItems
        });
      }

    }

    wx.setStorageSync("newItem", "isNull");
    wx.setStorageSync("cartProNum", this.data.selectItems.length)
    //计算总价
    this.sum();

    /* */
    let cartProNum = String(wx.getStorageSync("cartProNum"));
    if (null != cartProNum && '' != cartProNum && '0' != cartProNum) {
      wx.setTabBarBadge({
        index: 2,
        text: cartProNum,
      })
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 单选某个商品
  selectItem: function(e) {

    let i = e.currentTarget.dataset.index;
    this.data.selectItems[i].productSelect = !this.data.selectItems[i].productSelect;
    // 渲染页面数据，局部渲染
    this.setData({
      ["selectItems[" + i + "]"]: this.data.selectItems[i]
    });
    // 判断，列表中商品的选中状态是否全部相同
    let isAll = true;
    for (let j = 0; j < this.data.selectItems.length; j++) {
      if (this.data.selectItems[j].productSelect != this.data.selectItems[i].productSelect) {
        isAll = false;
        break;
      }
    }
    // 根据 isAll 判断
    if (isAll) {
      this.setData({
        selectAll: this.data.selectItems[i].productSelect
      });
    }
    //计算总价
    this.sum();

  },
  // 点击全选按钮（）
  selectAll: function() {
    this.data.selectAll = !this.data.selectAll;
    for (let i = 0; i < this.data.selectItems.length; i++) {
      this.data.selectItems[i].productSelect = this.data.selectAll;
    }
    // 渲染
    this.setData({
      selectAll: this.data.selectAll,
      selectItems: this.data.selectItems
    });
    //计算总价
    this.sum();
  },

  // 减法
  jian: function(e) {
    let i = e.currentTarget.dataset.index;
    if (this.data.selectItems[i].productNum >= 2) {
      this.data.selectItems[i].productNum = this.data.selectItems[i].productNum - 1;
      // 渲染,局部渲染
      this.setData({
        ["selectItems[" + i + "]"]: this.data.selectItems[i]
      });
    }
    //计算总价
    this.sum();
  },

  // 加法
  jia: function(e) {
    let i = e.currentTarget.dataset.index;
    this.data.selectItems[i].productNum = this.data.selectItems[i].productNum + 1;
    // 渲染,局部渲染
    this.setData({
      ["selectItems[" + i + "]"]: this.data.selectItems[i]
    });
    //计算总价
    this.sum();
  },
  // 删除购物车中某个商品
  remove: function(e) {
    let i = e.currentTarget.dataset.index;
    this.data.selectItems.splice(i, 1);
    // 渲染
    this.setData({
      selectItems: this.data.selectItems
    });
    //计算总价
    this.sum();

    let cartProNum = wx.getStorageSync("cartProNum") - 1;
    wx.setTabBarBadge({
      index: 2,
      text: String(cartProNum),
    });
    wx.setStorageSync("cartProNum", wx.getStorageSync("cartProNum") - 1);
    if (0 == cartProNum) {
      wx.removeTabBarBadge({
        index: 2
      });
    }
  },
  // 计算总价
  sum: function() {
    let temp = 0;
    for (let i = 0; i < this.data.selectItems.length; i++) {
      if (this.data.selectItems[i].productSelect) {
        temp = temp + this.data.selectItems[i].productNum * this.data.selectItems[i].productPrice;
      }
    }
    //渲染
    this.setData({
      total: temp.toFixed(2)
    });

  },

  pay: function() {

    
    /*清空小票缓存 */
    wx.removeStorageSync("selectItems");
    wx.removeStorageSync("total");
    wx.removeStorageSync("time");

    wx.setStorageSync("selectItems", this.data.selectItems);
    wx.setStorageSync("total", this.data.total);
    wx.setStorageSync("time", util.formatTime(new Date()));

    /* 金额单位是分，真坑 */
    let that = this;
    console.log("selectItems = " + this.data.selectItems);
    app.createProductOrderByServerOpenId(
      app.server.createOrderUrl,
      app.server.openId,
      that.data.total * 100,
      "购物车");

      /*
      如何在支付成功后从购物车中将支付成功的物品删除？？？ 
      */
  }

})