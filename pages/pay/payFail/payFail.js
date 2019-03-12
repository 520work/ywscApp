var app = getApp();
var util = require('../../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({
	goToIndex: function() {
		console.log('sss')
		wx.switchTab({
			url: '../../index/index'
		})
	},
	continueBuy: function() {
		var ywscOrderType = app.globalData.ywscOrderType;
		if (ywscOrderType == 1) {
			wx.navigateTo({
				url: '../../chooseNum/chooseNum'
			})
		} else if (ywscOrderType == 2) {
			//视频会员
		} else if (ywscOrderType == 3) {
			wx.navigateTo({
				url: '../../iCard/iCard'
			})
		} else if (ywscOrderType == 4) {
			wx.navigateTo({
				url: '../../hopeNum/hopeNum'
			})
		}
	},
	onLoad: function(options) {
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		var ywscOrderType = app.globalData.ywscOrderType,
			id = app.globalData.orderId,
			yufuStatus = app.globalData.yufu,
			that = this,
			guishudi = app.globalData.guishudi;
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
				var occupyMoney = that.keepTwoFloor(res.data[0].occupyMoney);
				var preDeposit = that.keepTwoFloor(res.data[0].preDeposit);
				var yhMoney = that.keepTwoFloor(res.data[0].yhMoney);
				var totalMoney = that.keepTwoFloor(res.data[0].totalMoney);
				var paidMoney = that.keepTwoFloor(res.data[0].paidMoney);
				var orderTime = that.timestampToTime(res.data[0].inserttime.time);
				that.setData({
					occupyMoney: occupyMoney,
					preDeposit: preDeposit,
					yhMoney: yhMoney,
					totalMoney: totalMoney,
					paidMoney: paidMoney,
					orderTime: orderTime,
					orderCardDatil: res.data[0]
				});
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
		getApp().globalData.ywscOrderType = '';
		getApp().globalData.orderId = '';
		getApp().globalData.yufu = '';
		getApp().globalData.guishudi = '';
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
	},
	//保留小数点后两位
	keepTwoFloor: function(value) {
		var num = Number(value), twoFloorNum;
		if (Number.isInteger(num)) {
			twoFloorNum = Number(num).toFixed(2);
		} else {
			var numArr = num.toString().split('.');
			if(numArr[1].length>=2){
				twoFloorNum = Math.floor(num * 100) / 100;
			} else {
				twoFloorNum = Number(num).toFixed(2);
			};
		};
		return twoFloorNum;
	}
})
