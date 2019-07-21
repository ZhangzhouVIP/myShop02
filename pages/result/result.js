const app = getApp()
var common = require('../../utils/common.js');
var util = require('../../utils/util')
var wxrequest = util.wxPromisify(wx.request)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    types: [
    ],
    typeTrees: [
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTrees(wx.getStorageSync("key"));
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
    if ('' != this.data.key) {
      
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

  },

  getTrees: function (productName) {

    this.data.typeTrees.splice(0, this.data.typeTrees.length);

    let allItems = wx.getStorageSync("allItems");

    for (let i = 0; i < allItems.length; i++) {
      if ((allItems[i].name.value).indexOf(productName) >= 0) {
        this.data.typeTrees.push(allItems[i]);
      }
    }

    this.setData({
      typeTrees: this.data.typeTrees
    });
  },

  goDetail: function (e) {

    var id = e.currentTarget.dataset.productid;

    let allItems = wx.getStorageSync("allItems");

    var item = {};
    allItems.forEach(element => {
      if (id == element.id.value) {
        item.id = element.id;
        item.name = element.name;
        item.price = element.price;
        item.unit = element.unit;
        item.inventory = element.inventory;
        item.transcost = element.transcost;
        item.listpicture = element.listpicture;
        item.describe = element.describe;
      }
    });

    wx.setStorageSync("DetailItem", item);


    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },

  bindKeyInput(e) {
    console.log(e.detail.value);
    this.setData({
      key: e.detail.value
    })

  },

  goResult: function () {
    this.getTrees(this.data.key);
  }

})