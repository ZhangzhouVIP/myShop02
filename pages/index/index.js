//index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 2000,
    // 商品集合（数组）
    items: [],

    item: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // wx.setStorageSync("allItems", this.data.items);/* 将模拟数据放入缓存 */

    wx.request({
      url: 'http://localhost:8080/baas/myshop/api/queryProducts',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        wx.setStorageSync("allItems", res.data.rows);
        that.setData({ items: res.data.rows });

      }
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
    /* 设置购物车商品种数 */
    let cartProNum = String(wx.getStorageSync("cartProNum"));
    if (null != cartProNum && '' != cartProNum && '0' != cartProNum) {
      wx.setTabBarBadge({
        index: 2,
        text: cartProNum,
      })
    } else {
      wx.removeTabBarBadge({ index: 2 });
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

  /*点击轮播图事件*/
  clickSwiper: function (e) {
    
  },

  /*点击列表事件*/
  goDetail: function (e) {

    var id = e.currentTarget.dataset.id;
    var item = {};
    this.data.items.forEach(element => {
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
      url: '../../pages/detail/detail',
    })
  },

  addcart: function (e) {
    
    let index = e.currentTarget.dataset.index;
    //准备传递给购物车的商品
    var item = {
      productID: this.data.items[index].id.value,
      productName: this.data.items[index].name.value,
      productPrice: this.data.items[index].price.value,
      pListPicture: this.data.items[index].listpicture.value,
      productSelect: true,
      productNum: 1
    };
    //缓存传递不同页面之间的数据
    wx.setStorageSync("newItem", item);
    //跳转页面
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },

  goSearch: function () {

    wx.navigateTo({
      url: '/pages/search/search',
    })
  }

})