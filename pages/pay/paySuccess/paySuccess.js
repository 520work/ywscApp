// pages/paysuccess/paysuccess.js
var util = require('../../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({
	goToIndex: function() {
		wx.switchTab({
			url: '../../index/index'
		})
	},
	data: {

	},
	onLoad: function(options) {
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		var ywscOrderType = wx.getStorageSync('ywscOrderType'),
			id = wx.getStorageSync('orderId'),
			yufuStatus = wx.getStorageSync('yufu'),
			that = this,
			guishudi = wx.getStorageSync('guishudi');
		that.setData({
			ywscOrderType: ywscOrderType,
			guishudi: guishudi
		});
		wx.request({
			url: ajaxUrl + 'orderCardServiceController.do?orderCardDatil',
			method: 'POST',
			data: {
				ywscOrderType: ywscOrderType,
				id: id
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				console.log(res);
				var occupyMoney = Number(res.data[0].occupyMoney).toFixed(2);
				var preDeposit = Number(res.data[0].preDeposit).toFixed(2);
				var yhMoney = Number(res.data[0].yhMoney).toFixed(2);
				var totalMoney = Number(res.data[0].totalMoney).toFixed(2);
				var paidMoney = Number(res.data[0].paidMoney).toFixed(2);
				var discountMoney = Number(res.data[0].discountMoney).toFixed(2);
				var orderTime = that.timestampToTime(res.data[0].inserttime.time);
				var payTime;
				if(res.data[0].dataTime == null){
					var nowdate = new Date();
					payTime = that.timestampToTime(nowdate);
				}else{
					payTime = that.timestampToTime(res.data[0].dataTime.time);
				}
				that.setData({
					occupyMoney: occupyMoney,
					preDeposit: preDeposit,
					yhMoney: yhMoney,
					totalMoney: totalMoney,
					paidMoney: paidMoney,
					discountMoney: discountMoney,
					orderTime: orderTime,
					payTime: payTime,
					orderCardDatil: res.data[0]
				});
				//判断付全款还是付定金 是否显示温馨提示
				if (yufuStatus == true) {
					that.setData({
						payStatusText: '定金已付，请尽快支付尾款',
						tipsStatus: true,
						sfje: '已付定金'
					})
				} else {
					that.setData({
						payStatusText: '付款成功',
						tipsStatus: false,
						sfje: '实际付款'
					})
				};
				//判断是否为特卖情侣号
				if (res.data[0].phoneNumber1 != '') {
					var phoneNumber = res.data[0].phoneNumber.split(',');
					that.setData({
						qinglvhao: true,
						'orderCardDatil.phoneNumber': phoneNumber[0]
					})
				} else {
					that.setData({
						qinglvhao: false,
					})
				};
			},
			fail: err => {
				console.log(err);
			},
			complete: res => {
				wx.hideLoading();
			}
		});
	},
	onHide: function() {
        wx.removeStorageSync('ywscOrderType');
        wx.removeStorageSync('orderId');
				wx.removeStorageSync('yufu');
				wx.removeStorageSync('guishudi');
    },
	timestampToTime: function(timestamp) {
		var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
		var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
		return Y + M + D + h + m + s;
	}
})
