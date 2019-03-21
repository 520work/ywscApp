// pages/index/weblink.js
Page({
  onLoad: function (options) {
    var that = this;
		console.log(options);
    that.setData({
      bannerLink: options.linkPath
    })
  }
})