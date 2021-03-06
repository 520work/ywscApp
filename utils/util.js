var app = getApp();
var ajaxUrl = 'https://www.m10027.com/jeewx/';

//省市区三联动 piker选项操作
var bindChange = function(e) {
	var val = e.detail.value;
	var t = this.data.values;
	var cityData = this.data.cityData;
	//省份
	if (val[0] != t[0]) {
		const citys = [];
		const countys = [];
		for (let i = 0; i < cityData[val[0]].sub.length; i++) {
			citys.push(cityData[val[0]].sub[i].name);
		};
		if (cityData[val[0]].sub[0].sub == undefined) {
			this.setData({
				province: this.data.provinces[val[0]],
				city: cityData[val[0]].sub[0].name,
				citys: citys,
				county: [],
				countys: [],
				values: val,
				value: [val[0], 0, 0]
			});
			return;
		} else {
			for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
				countys.push(cityData[val[0]].sub[0].sub[i].name);
			};
			this.setData({
				province: this.data.provinces[val[0]],
				city: cityData[val[0]].sub[0].name,
				citys: citys,
				county: cityData[val[0]].sub[0].sub[0].name,
				countys: countys,
				values: val,
				value: [val[0], 0, 0]
			});
			return;
		}
	};
	//城市
	if (val[1] != t[1]) {
		const countys = [];
		if (cityData[val[0]].sub[val[1]].sub !== undefined) {
			for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
				countys.push(cityData[val[0]].sub[val[1]].sub[i].name);
			};
			this.setData({
				city: this.data.citys[val[1]],
				county: cityData[val[0]].sub[val[1]].sub[0].name,
				countys: countys,
				values: val,
				value: [val[0], val[1], 0]
			});
			return;
		} else {
			this.setData({
				city: this.data.citys[val[1]],
				county: '',
				countys: countys,
				values: val,
				value: [val[0], val[1], 0]
			});
		};
	};
	//市区
	if (val[2] != t[2]) {
		this.setData({
			county: this.data.countys[val[2]],
			values: val
		});
		return;
	};
};

//打开或者关闭省市区三联动弹窗
var openAddressModel = function() {
	this.setData({
		condition: !this.data.condition
	});
};

//初始化省市区三联动
var initAddress = function(that, tcity, source) {
	//获取地址数据源
	if (source == "queryData") {
		that.setData({
			cityData: tcity
		});
	} else {
		that.setData({
			cityData: tcity.cityData
		});
	}
	var cityData = that.data.cityData;
	//声明空数组 用于存放不同级别的地名
	const provinces = [];
	const citys = [];
	const countys = [];
	//省份数组
	for (let i = 0; i < cityData.length; i++) {
		provinces.push(cityData[i].name);
	};
	//城市数组
	for (let i = 0; i < cityData[0].sub.length; i++) {
		citys.push(cityData[0].sub[i].name)
	};
	//县/区设置
	if (cityData[0].sub[0].sub == undefined) {
		that.setData({
			'provinces': provinces,
			'citys': citys,
			'countys': [],
			'province': cityData[0].name,
			'city': cityData[0].sub[0].name,
			'county': []
		});
	} else {
		for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
			countys.push(cityData[0].sub[0].sub[i].name)
		};

		that.setData({
			'provinces': provinces,
			'citys': citys,
			'countys': countys,
			'province': cityData[0].name,
			'city': cityData[0].sub[0].name,
			'county': cityData[0].sub[0].sub[0].name
		});
	}
};
//去套餐页面
var chooseTaocan = function(telNum, whereFrom, occupyMoney, doubleNumStatus, qlTelNum, qlTelNum1, dataCode, sale,
	tmType) {
	wx.navigateTo({
		url: '../taocanBoard/taocanBoard?telNum=' + telNum + '&whereFrom=' + whereFrom + '&occupyMoney=' + occupyMoney +
			'&qlTelNum=' + qlTelNum + '&qlTelNum1=' + qlTelNum1 + '&doubleNumStatus=' + doubleNumStatus + '&dataCode=' +
			dataCode + '&sale=' + sale + '&tmType=' + tmType
	});
};

//付款接口
var wxPay = function(payOpenId, paidMoney, orderNo, that, spName) {
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
							url: '../pay/paySuccess/paySuccess'
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
									url: '../pay/payFail/payFail'
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
							url: '../pay/payFail/payFail'
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
						url: '../pay/payFail/payFail'
					})
				}
			});
		}
	});
};
var saveImgToPhotosAlbumTap = function(that, imgSrc) {
	wx.downloadFile({
		url: imgSrc,
		success: function(res) {
			wx.saveImageToPhotosAlbum({
				filePath: res.tempFilePath,
				success: function(res) {
					that.setData({
						'downModelInfo.showModelStatus': false
					});
					wx.showToast({
						title: '图片已保存至相册',
						duration: 2000
					});
				},
				fail: function(res) {
					wx.showToast({
						icon: 'none',
						title: '图片保存失败',
						duration: 2000
					});
				}
			})
		},
		fail: function() {
			wx.showToast({
				icon: 'none',
				title: '图片保存失败',
				duration: 2000
			});
		}
	})
};
module.exports = {
	openAddressModel: openAddressModel,
	bindChange: bindChange,
	initAddress: initAddress,
	ajaxUrl: ajaxUrl,
	chooseTaocan: chooseTaocan,
	wxPay: wxPay,
	saveImgToPhotosAlbumTap: saveImgToPhotosAlbumTap
}
