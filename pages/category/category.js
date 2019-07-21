const app = getApp()
var common = require('../../utils/common.js');
var util = require('../../utils/util')
var wxrequest = util.wxPromisify(wx.request)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur: 0,
    classID: 1001,
    types: [
    ],
    typeTrees: [
    ]


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wxrequest({
      url: 'http://localhost:8080/baas/myshop/api/queryProducttype',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      }
    }).then(res => {
      that.setData({ types: res.data.rows });
      that.getTrees(that.data.classID);
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

  getCur: function (e) {
    this.setData({
      cur: e.currentTarget.dataset.selectindex
    });
    this.setData({
      classID: e.currentTarget.dataset.classid
    });

    this.getTrees(this.data.classID);

  },

  getTrees: function (classID) {

    this.data.typeTrees.splice(0, this.data.typeTrees.length);

    let allItems = wx.getStorageSync("allItems");

    for (let i = 0; i < allItems.length; i++) {

      if (allItems[i].type.value == classID) {

        this.data.typeTrees.push(allItems[i]);

      }
    }

    this.setData({
      typeTrees: this.data.typeTrees
    });
  },

  goDetail: function (e) {
    var productID = e.currentTarget.dataset.productid;

    let allItems = wx.getStorageSync("allItems");

    var item = {};
    allItems.forEach(element => {
      if (productID == element.id.value) {
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
      url: '../../pages/detail/detail',
    })


  },

  goSearch: function () {

    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
  
})