// pages/pay/upto3000/upto3000.js
var util = require('../../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
var app = getApp();
Page({
	onLoad: function(options) {
		var that = this;
		var qinglvhao;
		if (options.phoneNumber1 != '') {
			qinglvhao = true;
		} else {
			qinglvhao = false
		};
		var occupyMoney = that.keepTwoFloor(options.occupyMoney),
			preDeposit = that.keepTwoFloor(options.preDeposit),
			yhMoney = that.keepTwoFloor(options.yhMoney),
			paidMoney = that.keepTwoFloor(options.paidMoney),
			discountMoney = that.keepTwoFloor(options.discountMoney);

		that.setData({
			qinglvhao: qinglvhao,
			phoneNumber: options.phoneNumber,
			phoneNumber1: options.phoneNumber1,
			city: options.city,
			occupyMoney: occupyMoney,
			preDeposit: preDeposit,
			yhMoney: yhMoney,
			paidMoney: paidMoney,
			discountMoney: discountMoney,
			payOpenId: options.payOpenId,
			orderNo: options.orderNo
		})
	},
	gotoPay: function() {
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		var that = this;
		var payOpenId = that.data.payOpenId;
		var paidMoney = that.data.discountMoney;
		var orderNo = that.data.orderNo;
		that.wxPay(payOpenId, paidMoney, orderNo, that, '小程序号卡商城');
	},
	wxPay: function(payOpenId, paidMoney, orderNo, that, spName) {
		wx.request({
			url: 'https://www.m10027.com/wxlhhd/wxPay.ashx?',
			method: 'POST',
			data: {
				op: 'wxpay',
				openid: payOpenId,
				phoneno: '',
				sjprices: paidMoney,
				dkprices: '0',
				ticketcode: '000000',
				ruleType: '2',
				paywx: '6',
				orderno: orderNo,
				spname: spName
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				if (res.statusCode == 200) {
					wx.requestPayment({
						timeStamp: res.data.timeStamp,
						nonceStr: res.data.nonceStr,
						package: res.data.packageStr,
						signType: res.data.signType,
						paySign: res.data.paySign,
						success(res) {
							wx.hideLoading();
							wx.showLoading({
								mask: true,
								title: '支付结果确认中'
							});

							wx.redirectTo({
								url: '../paySuccess/paySuccess'
							});
						},
						fail(res) {
							wx.hideLoading();
							wx.showLoading({
								mask: true,
								title: '支付结果确认中'
							});
							var orderId = app.globalData.orderId;
							wx.request({
								url: ajaxUrl + 'orderCardServiceController.do?updateOrder',
								method: 'POST',
								data: {
									id: orderId
								},
								header: {
									"Content-Type": "application/x-www-form-urlencoded"
								},
								success: res => {
									wx.redirectTo({
										url: '../payFail/payFail'
									})
								}
							});
						}
					})
				} else {
					wx.hideLoading();
					that.setData({
						'tipsModelInfo.title': '微信支付异常,请稍后再试',
						'tipsModelInfo.btn': '确定',
						'tipsModelInfo.showModelStatus': true
					});
					var orderId = app.globalData.orderId;
					wx.request({
						url: ajaxUrl + 'orderCardServiceController.do?updateOrder',
						method: 'POST',
						data: {
							id: orderId
						},
						header: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						success: res => {
							wx.redirectTo({
								url: '../payFail/payFail'
							})
						}
					});
				};
			},
			fail: err => {
				wx.hideLoading();
				that.setData({
					'tipsModelInfo.title': '支付异常,请稍后再试',
					'tipsModelInfo.btn': '确定',
					'tipsModelInfo.showModelStatus': true
				});
				var orderId = app.globalData.orderId;
				wx.request({
					url: ajaxUrl + 'orderCardServiceController.do?updateOrder',
					method: 'POST',
					data: {
						id: orderId
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					success: res => {
						wx.redirectTo({
							url: '../payFail/payFail'
						})
					}
				});
			}
		});
	},
	//保留小数点后两位
	keepTwoFloor: function(value) {
		var num = Number(value),
			twoFloorNum;
		if (Number.isInteger(num)) {
			twoFloorNum = Number(num).toFixed(2);
		} else {
			var numArr = num.toString().split('.');
			if (numArr[1].length >= 2) {
				twoFloorNum = Math.floor(num * 100) / 100;
			} else {
				twoFloorNum = Number(num).toFixed(2);
			};
		};
		return twoFloorNum;
	}
})
