// 订单详情页面
var app = getApp();
var util = require('../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({
	data: {
		moreOrLess: true,
		toggleStatus: false
	},
	onLoad: function(options) {
		var that = this,
			openId = app.globalData.openId,
			orderType = options.orderType,
			orderId = options.orderId;
		that.setData({
			openId: openId
		});
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		if (orderType == 1) {
			that.setData({
				haokaPriceDetails: true,
				orderImg: '../../images/cartbig.png'
			});
			that.orderCardDatil(that, orderId, orderType);
		} else if (orderType == 2) {
			that.setData({
				orderImg: '../../images/cartbig.png'
			});
			//vip订单详情
			wx.request({
				url: 'https://www.m10027.com/wxlhhd/ywscOrderServices.ashx?requestType=GetOrderDetailedInfo&orderId=' +
					orderId,
				success: res => {
					wx.hideLoading();
					//快递公司以及快递单号
					var expressCompany, expressNumbers;
					if (res.data.expressCompany) {
						expressCompany = res.data.expressCompany;
					} else {
						expressCompany = "暂无";
					}
					if (res.data.expressNumbers) {
						expressNumbers = res.data.expressNumbers;
					} else {
						expressNumbers = "暂无";
					};
					//下单时间和付款时间
					var orderTime = res.data.dataTime;
					var buyTime;
					if (res.data.inserttime) {
						buyTime = that.timestampToTime(res.data.inserttime);
					} else {
						buyTime = "暂无";
					};
					that.setData({
						userName: res.data.userName,
						phone: res.data.phone,
						userAddress: res.data.userAddress,
						expressCompany: expressCompany,
						expressNumbers: expressNumbers,
						orderTitle: res.data.phoneNumber,
						paidMoney: that.keepTwoFloor(res.data.paidMoney),
						iccidStatus: false,
						orderId: orderId,
						orderTime: orderTime,
						buyTime: buyTime,
						toggleView: false
					})
				},
				fail: err => {
					wx.hideLoading();
					wx.showToast({
						title: '加载失败，请稍后再试。',
						icon: 'none',
						duration: 2000
					});
				}
			});
		} else if (orderType == 3) {
			that.setData({
				ikaPriceDetails: true,
				orderImg: '../../images/ikaorderinfo_023_07.png'
			});
			that.orderCardDatil(that, orderId, orderType);
		} else if (orderType == 4) {
			that.setData({
				ikaPriceDetails: true,
				orderImg: '../../images/ekalogo.png'
			});
			that.orderCardDatil(that, orderId, orderType);
		};
	},
	//号卡 ika eka请求订单详情
	orderCardDatil: function(that, orderId, orderType) {
		wx.request({
			url: ajaxUrl + 'orderCardServiceController.do?orderCardDatil',
			method: 'POST',
			data: {
				ywscOrderType: orderType,
				id: orderId
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				wx.hideLoading();
				//快递公司以及快递单号
				var expressCompany, expressNumbers;
				if (res.data[0].expressCompany) {
					expressCompany = res.data[0].expressCompany;
				} else {
					expressCompany = "暂无";
				}
				if (res.data[0].expressNumbers) {
					expressNumbers = res.data[0].expressNumbers;
				} else {
					expressNumbers = "暂无";
				};
				//iccid
				var iccidStatus, iccidArr = [],
					toggleView = false;
				if (res.data[0].orderState == 0) {
					iccidStatus = false;
				} else {
					if (res.data[0].ICCID.length > 5) {
						toggleView = true;
					};

					if (res.data[0].ICCID.length > 0) {
						iccidStatus = true;
						iccidArr = res.data[0].ICCID;
						for (var i = 0; i < iccidArr.length; i++) {
							if (iccidArr[i].ICCIDstate == 1) {
								iccidArr[i].iccidstate = "去激活";
								iccidArr[i].goactstate = "goact";
								iccidArr[i].orderType = orderType;
							} else if (iccidArr[i].ICCIDstate == 2) {
								iccidArr[i].iccidstate = "已激活";
								iccidArr[i].goactstate = "actived";
								iccidArr[i].orderType = orderType;
							}
						};
					} else {
						iccidStatus = false;
					}
				};
				//下单时间和付款时间
				var orderTime = that.timestampToTime(res.data[0].inserttime.time);
				var buyTime;
				if (res.data[0].dataTime) {
					buyTime = that.timestampToTime(res.data[0].dataTime.time);
				} else {
					buyTime = "暂无";
				};
				//购买信息标题
				var orderTitle;
				if (orderType == 1) {
					orderTitle = '远特信时空号卡：' + res.data[0].phoneNumber;
				} else if (orderType == 3) {
					orderTitle = '远特i卡卡板 × ' + res.data[0].num;
				} else if (orderType == 4) {
					orderTitle = '远特e卡号段：' + res.data[0].sectionNo + '×' + res.data[0].num;
				};
				that.setData({
					userName: res.data[0].userName,
					phone: res.data[0].phone,
					userAddress: res.data[0].userAddress,
					expressCompany: expressCompany,
					expressNumbers: expressNumbers,
					paidMoney: that.keepTwoFloor(res.data[0].paidMoney),
					occupyMoney: that.keepTwoFloor(res.data[0].occupyMoney),
					preDeposit: that.keepTwoFloor(res.data[0].preDeposit),
					yhMoney: that.keepTwoFloor(res.data[0].yhMoney),
					totalMoney: that.keepTwoFloor(res.data[0].totalMoney),
					iccidStatus: iccidStatus,
					iccidArr: iccidArr,
					orderId: res.data[0].outTradeNo,
					orderTime: orderTime,
					buyTime: buyTime,
					orderTitle: orderTitle,
					toggleView: toggleView,
					num: res.data[0].num
				})
			},
			fail: err => {
				wx.hideLoading();
				wx.showToast({
					title: '加载失败，请稍后再试。',
					icon: 'none',
					duration: 2000
				});
			}
		});
	},
	//iccid展开
	lookMore: function() {
		this.setData({
			toggleStatus: true,
			moreOrLess: false
		});
	},
	//iccid收起
	lookLess: function() {
		this.setData({
			toggleStatus: false,
			moreOrLess: true
		});
	},
	//iccid去激活
	goact: function(e) {
		var ikaOreka = e.currentTarget.dataset.ikaoreka;
		if (ikaOreka == 3) {
			//跳转ika激活
			wx.navigateTo({
				url: 'ikajihuo/ikajihuo'
			});
		} else if (ikaOreka == 4) {
			//跳转eka激活
			wx.navigateToMiniProgram({
				appId: 'wx0a632502026a1075',
				path: 'pages\index\index',
				envVersion: 'release'
			});
		};
	},
	//处理时间格式
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
