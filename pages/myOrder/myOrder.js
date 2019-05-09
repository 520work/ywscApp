var app = getApp();
var util = require('../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({
	data: {
		navid: 0
	},
	onLoad: function(options) {
		var that = this;
		//获取订单
		wx.showLoading({
			mask: true,
			title: '订单加载中'
		});
		var openId = app.globalData.openId;
		that.getOrderLists(openId, that);
	},
	//获取订单列表信息
	getOrderLists: function(openId, that) {
		wx.request({
			url: 'https://www.m10027.com/wxlhhd/ywscOrderServices.ashx?requestType=GetOrderList&openId=' + openId,
			success: function(res) {
				wx.hideLoading();
				var haokamall = [];
				var vipmall = [];
				var ekamall = [];
				var ikamall = [];
				if (res.data != null) {
					res.data.forEach(function(item, index) {
						if (item.del == 0) {
							if (item.ywscOrderType == 1) {
								haokamall.push(item);
							} else if (item.ywscOrderType == 2) {
								vipmall.push(item);
							} else if (item.ywscOrderType == 3) {
								ikamall.push(item);
							} else if (item.ywscOrderType == 4) {
								ekamall.push(item);
							}
						}
					});
					//号卡列表
					if (haokamall.length == 0) {
						that.setData({
							haokaNoOrder: true
						})
					} else {
						for (var i = 0; i < haokamall.length; i++) {
							haokamall[i].om = that.keepTwoFloor(haokamall[i].occupyMoney);
							haokamall[i].pd = that.keepTwoFloor(haokamall[i].pre_deposit);
							haokamall[i].tm = that.keepTwoFloor(haokamall[i].totalMoney);
							var send_state = haokamall[i].send_state;
							var state = haokamall[i].orderState;
							if (send_state == "1") {
								if (state == "8") {
									haokamall[i].state = "已发货";
									haokamall[i].step = "查看物流";
									haokamall[i].stepuse = "lookstep";
								} else if (state == "9") {
									haokamall[i].state = "交易成功";
									haokamall[i].step = "删除订单";
									haokamall[i].stepuse = "delorder";
								}
							} else {
								if (state == "0") {
									haokamall[i].state = "交易失败";
									haokamall[i].step = "查看详情";
									haokamall[i].stepuse = "lookinfo";
								} else if (state == "1") {
									haokamall[i].state = "已付款";
									haokamall[i].step = "查看详情";
									haokamall[i].stepuse = "lookinfo";
								} else if (state == "4") {
									haokamall[i].state = "交易失败";
									haokamall[i].step = "删除订单";
									haokamall[i].stepuse = "delorder";
								} else if (state == "5") {
									haokamall[i].state = "交易失败";
									haokamall[i].step = "删除订单";
									haokamall[i].stepuse = "delorder";
								} else if (state == "6") {
									haokamall[i].state = "交易失败";
									haokamall[i].step = "删除订单";
									haokamall[i].stepuse = "delorder";
								} else if (state == "9") {
									haokamall[i].state = "交易成功";
									haokamall[i].step = "删除订单";
									haokamall[i].stepuse = "delorder";
								} else if (state == "7") {
									haokamall[i].state = "已付款";
									haokamall[i].step = "查看详情";
									haokamall[i].stepuse = "lookinfo";
								} else if (state == "11") {
									haokamall[i].state = "待支付尾款";
									haokamall[i].step = "查看详情";
									haokamall[i].stepuse = "lookinfo";
									haokamall[i].containuepay = true;
								}
							}
						}
					};
					//E卡列表
					if (ekamall.length == 0) {
						that.setData({
							ekaNoOrder: true
						})
					} else {
						that.orderLists(ekamall, that);
					};
					//i卡列表
					if (ikamall.length == 0) {
						that.setData({
							ikaNoOrder: true
						})
					} else {
						that.orderLists(ikamall, that);
					};
					//会员中心
					if (vipmall.length == 0) {
						that.setData({
							vipNoOrder: true
						})
					} else {
						for (var i = 0; i < vipmall.length; i++) {
							var state = vipmall[i].orderState;
							vipmall[i].tm = that.keepTwoFloor(vipmall[i].totalMoney);
							if (state == "4") {
								vipmall[i].state = "交易失败";
								vipmall[i].step = "删除订单";
								vipmall[i].stepuse = "delorder";
							} else if (state == "5") {
								vipmall[i].state = "交易失败";
								vipmall[i].step = "删除订单";
								vipmall[i].stepuse = "delorder";
							} else if (state == "6") {
								vipmall[i].state = "交易失败";
								vipmall[i].step = "删除订单";
								vipmall[i].stepuse = "delorder";
							} else if (state == "1") {
								vipmall[i].state = "交易成功";
								vipmall[i].step = "删除订单";
								vipmall[i].stepuse = "delorder";
							} else if (state == "7") {
								vipmall[i].state = "已付款";
								vipmall[i].step = "查看详情";
								vipmall[i].stepuse = "lookinfo";
							};
							//判断会员商品类型 添加图标地址属性
							var imgSourceType = vipmall[i].productType;
							if (imgSourceType == 1) {
								vipmall[i].imgSourceSrc = "../../images/kuwo.png";
							} else if (imgSourceType == 2) {
								vipmall[i].imgSourceSrc = "../../images/souhu.png";
							} else if (imgSourceType == 3) {
								vipmall[i].imgSourceSrc = "../../images/mobike.png";
							}
						}
					};
					that.setData({
						haokamall: haokamall,
						vipmall: vipmall,
						ekamall: ekamall,
						ikamall: ikamall
					});
				}
			},
			fail: function(err) {
				console.log(err);
			}
		});
	},
	//E卡和I卡的订单列表
	orderLists: function(mallData, that) {
		for (var i = 0; i < mallData.length; i++) {
			var send_state = mallData[i].send_state;
			var state = mallData[i].orderState;
			mallData[i].tm = that.keepTwoFloor(mallData[i].totalMoney);
			if (send_state == "1") {
				if (state == "8") {
					mallData[i].state = "已发货";
					mallData[i].step = "查看物流";
					mallData[i].stepuse = "lookstep";
				} else if (state == "9") {
					mallData[i].state = "交易成功";
					mallData[i].step = "删除订单";
					mallData[i].stepuse = "delorder";
				}
			} else {
				if (state == "0") {
					mallData[i].state = "交易失败";
					mallData[i].step = "查看详情";
					mallData[i].cancelorder = true;
					mallData[i].stepuse = "lookinfo";
				} else if (state == "1") {
					mallData[i].state = "已付款";
					mallData[i].step = "查看详情";
					mallData[i].stepuse = "lookinfo";
				} else if (state == "4") {
					mallData[i].state = "交易失败";
					mallData[i].step = "删除订单";
					mallData[i].stepuse = "delorder";
				} else if (state == "5") {
					mallData[i].state = "交易失败";
					mallData[i].step = "删除订单";
					mallData[i].stepuse = "delorder";
				} else if (state == "6") {
					mallData[i].state = "交易失败";
					mallData[i].step = "删除订单";
					mallData[i].stepuse = "delorder";
				} else if (state == "9") {
					mallData[i].state = "交易成功";
					mallData[i].step = "删除订单";
					mallData[i].stepuse = "delorder";
				} else if (state == "7") {
					mallData[i].state = "已付款";
					mallData[i].step = "查看详情";
					mallData[i].stepuse = "lookinfo";
				}
			}
		}
	},
	//切换选项卡
	switchNav: function(e) {
		this.setData({
			navid: e.currentTarget.dataset.index
		})
	},
	//点击订单主体部分 查看订单详情
	orderDetails: function(e) {
		var orderId = e.currentTarget.dataset.orderid;
		var orderType = e.currentTarget.dataset.ordertype;
		var imgSource = e.currentTarget.dataset.imgsource;
		wx.navigateTo({
			url: '../orderDetails/orderDetails?orderId=' + orderId + '&orderType=' + orderType + '&imgSource=' + imgSource
		});
	},
	//点击查看详情按钮 查看订单详情
	lookinfo: function(e) {
		var orderId = e.currentTarget.dataset.orderid;
		var orderType = e.currentTarget.dataset.ordertype;
		var imgSource = e.currentTarget.dataset.imgsource;
		wx.navigateTo({
			url: '../orderDetails/orderDetails?orderId=' + orderId + '&orderType=' + orderType + '&imgSource=' + imgSource
		});
	},
	//查看物流信息
	lookstep: function(e) {
		var expressCompany = e.currentTarget.dataset.kdgs;
		var expressNumber = e.currentTarget.dataset.expressnumber;
		wx.navigateTo({
			url: '../express/express?expressCompany=' + expressCompany + '&expressNumber=' + expressNumber
		});
	},
	//支付尾款
	containuePay: function(e) {
		var orderId = e.currentTarget.dataset.orderid;
		var orderType = e.currentTarget.dataset.ordertype;
		getApp().globalData.ywscOrderType = orderType;
		getApp().globalData.orderId = orderId;
		getApp().globalData.yufu = true;
		wx.redirectTo({
			url: '../pay/paySuccess/paySuccess'
		});
	},
	//取消订单
	cancelOrder: function(e) {
		var orderId = e.currentTarget.dataset.orderid;
		this.setData({
			'delModelInfo.showModelStatus': true,
			'delModelInfo.title': '取消订单',
			'delModelInfo.content': '确认取消吗？',
			'delModelInfo.cancelBtn': '取消',
			'delModelInfo.confirmBtn': '确认',
			orderId: orderId
		});
	},
	//关闭提示弹框
	goBackBtn: function(e) {
		this.setData({
			'delModelInfo.showModelStatus': false,
			'delModelInfo1.showModelStatus': false
		});
	},
	//确认取消订单
	confirmBtn: function(e) {
		var orderId = this.data.orderId;
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
				this.setData({
					'delModelInfo.showModelStatus': false
				});
				wx.showToast({
					title: '取消成功！',
					icon: 'success',
					duration: 2000
				});
				var openId = app.globalData.openId;
				var that = this;
				var navid = that.data.navid;
				that.getOrderLists(openId, that);
				that.setData({
					navid: navid
				});
			},
			fail: err => {
				this.setData({
					'delModelInfo.showModelStatus': false
				});
				wx.showToast({
					title: '取消失败！',
					icon: 'none',
					duration: 2000
				});
			}
		});
	},
	//删除订单
	delorder: function(e) {
		var removeId = e.currentTarget.dataset.orderid;
		var orderType = e.currentTarget.dataset.ordertype;
		this.setData({
			'delModelInfo1.showModelStatus': true,
			'delModelInfo1.title': '删除订单',
			'delModelInfo1.content': '确认删除吗？',
			'delModelInfo1.cancelBtn': '取消',
			'delModelInfo1.confirmBtn': '确认',
			removeId: removeId,
			ywscOrderType: orderType
		});
	},
	confirmBtn1: function(e) {
		var removeId = this.data.removeId,
			ywscOrderType = this.data.ywscOrderType,
			that = this;
		if (ywscOrderType == 2) {
			wx.request({
				url: 'https://www.m10027.com/wxlhhd/ywscOrderServices.ashx?requestType=DeleteOrder&orderId=' + removeId,
				success: function(res) {
					that.setData({
						'delModelInfo1.showModelStatus': false
					});
					wx.showToast({
						title: '删除成功！',
						icon: 'success',
						duration: 2000
					});
					var openId = app.globalData.openId;
					var navid = that.data.navid;
					that.getOrderLists(openId, that);
					that.setData({
						navid: navid
					});
				},
				fail: function(err) {
					that.setData({
						'delModelInfo1.showModelStatus': false
					});
					wx.showToast({
						title: '删除失败！',
						icon: 'none',
						duration: 2000
					});
				}
			});
		} else {
			wx.request({
				url: ajaxUrl + 'orderCardServiceController.do?doDel&id=' + removeId + '&ywscOrderType=' + ywscOrderType,
				success: function(res) {
					that.setData({
						'delModelInfo1.showModelStatus': false
					});
					wx.showToast({
						title: '删除成功！',
						icon: 'success',
						duration: 2000
					});
					var openId = app.globalData.openId;
					var navid = that.data.navid;
					that.getOrderLists(openId, that);
					that.setData({
						navid: navid
					});
				},
				fail: function(err) {
					that.setData({
						'delModelInfo1.showModelStatus': false
					});
					wx.showToast({
						title: '删除失败！',
						icon: 'none',
						duration: 2000
					});
				}
			});
		}
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
