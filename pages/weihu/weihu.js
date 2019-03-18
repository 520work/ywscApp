// pages/index/weihu.js
Page({
  data: {
    weihuMsg: ''
  },
  onLoad: function (options) {
    this.setData({
      weihuMsg: wx.getStorageSync('weihumsg')

    });
  }
})