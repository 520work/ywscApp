// pages/express/express.js
var util = require('../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({
	onLoad: function(options) {
		var that = this,
			expressCompany = options.expressCompany,
			expressNumber = options.expressNumber;
		that.setData({
			expressCompany: expressCompany,
			expressNumber: expressNumber
		});
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		wx.request({
			url: ajaxUrl + 'orderCardServiceController.do?expressInfo',
			method: 'POST',
			data: {
				expressCompany: expressCompany,
				expressNumber: expressNumber
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				if (res.statusCode == 200) {
					wx.hideLoading();
					console.log(res);

					var arr = [];
					var arr1 = [];
					if (res.data == "") {
						that.setData({
							noExpress: true
						});
					} else {
						arr = res.data;
						arr1 = arr.reverse();
						for (var i = 0; i < arr1.length; i++) {
							var itemDay = arr1[i].AcceptTime.split(" ")[0];
							var itemTime = arr1[i].AcceptTime.split(" ")[1];
							arr1[i].itemDay = itemDay;
							arr1[i].itemTime = itemTime;
							that.setData({
								expressLists: arr1
							});
						}
					};
				} else {
					wx.hideLoading();
					that.setData({
						noExpress: true
					});
					wx.showToast({
						title: '请稍后再试~',
						icon: 'none',
						duration: 2000
					});
				}
			},
			fail: err => {
				wx.hideLoading();
				that.setData({
					noExpress: true
				});
				wx.showToast({
					title: '请稍后再试~',
					icon: 'none',
					duration: 2000
				});
			}
		});
	}
})
