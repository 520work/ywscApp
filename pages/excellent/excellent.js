// pages/excellent/excellent.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		introduce1: true,
		introduce2: false,
		datacode: 1353168
	},
	onLoad: function(options) {
		var that = this;
		that.setData({
			code: options.code
		})
	},
	chooseFisrt: function(e) {
		var introduce1 = !this.data.introduce1;
		var introduce2 = !this.data.introduce2;
		this.setData({
			introduce1: introduce1,
			introduce2: introduce2,
			datacode: 1353168
		})
	},
	chooseSecond: function(e) {
		var introduce1 = !this.data.introduce1;
		var introduce2 = !this.data.introduce2;
		this.setData({
			introduce1: introduce1,
			introduce2: introduce2,
			datacode: 1353170
		})
	},
	goToChooseNum: function(e) {
		wx.navigateTo({
			url: '../chooseNum/chooseNum?code=' + this.data.code + '&datacode=' + this.data.datacode
		})
	}
})
