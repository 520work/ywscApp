var app = getApp();
var util = require('../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({
	data: {
		num: 1,
		minusStatus: 'disabled',
		plusStatus: 'normal',
		totalPrice: '20',
		showModalStatus: false,
		checkValue: true,
		downModelInfo: {
			showModelStatus: false,
			appImgSrc: 'https://www.m10027.com/xiaochengxubanner/ikQRCode.png'
		}
	},
	onLoad: function(options) {
		var that = this;
		//获取开关信息
		var upadateIkgs = app.globalData.upadateIkgs;
		var maxBuyCardNum;
		if(upadateIkgs == 0){
			maxBuyCardNum = 150;
		} else {
			maxBuyCardNum = 5;
		};
		that.setData({
			maxBuyCardNum: maxBuyCardNum
		});
		//地址显示
		var openId = app.globalData.payOpenId;
		wx.request({
			url: ajaxUrl + 'userAddressController.do?addressList' + '&openid=' + openId,
			success: function(res) {
				if (res.data == "") {
					that.setData({
						addressStatus: false
					});
				} else {
					var addressLists = res.data;
					for (var i = 0; i < addressLists.length; i++) {
						if (addressLists[i].sort == 1) {
							var addressData = "收货人：" + addressLists[i].contacts + " " + addressLists[i].phonenumber + " 收货地址：" +
								addressLists[i].address + " " + addressLists[i].street;
							that.setData({
								addressStatus: true,
								'addressData.showText': addressData,
								'addressData.contacts': addressLists[i].contacts,
								'addressData.phonenumber': addressLists[i].phonenumber,
								'addressData.userAddress': addressLists[i].address + " " + addressLists[i].street
							});
						};
					};
				};
			},
			fail: function(err) {
				console.log(err);
				wx.showToast({
					title: '获取地址失败，请稍后重试。',
					icon: 'none',
					duration: 2000
				});
			}
		});
	},
	onShow: function() {
		var that = this;
		var addressData = app.globalData.addressData;
		if (addressData !== undefined) {
			that.setData({
				addressStatus: true,
				addressData: addressData
			});
		}
	},
	//规则详情弹窗
	bindRule: function() {
		var maxBuyCardNum = this.data.maxBuyCardNum;
		wx.showModal({
			title: '远特i卡购买规则',
			content: '1.每日购买数量不得超过'+maxBuyCardNum+'张；\r\n2.通过下载【远特i卡】APP进行自助选号开卡；\r\n3.在远微商城购买远特i卡后将以快递形式邮寄；\r\n4.在购买远特i卡后，会在T+2个工作日内邮寄号卡，周末及节假日不邮寄；\r\n5.远特i卡售出后，如有质量问题，可免费更换一次，邮费需自理；\r\n6.购买远特i卡后在使用过程中出现问题可联系10027人工客服咨询；',
			showCancel: false
		})
	},
	/* 点击减号 */
	bindMinus: function() {
		var num = this.data.num;
		var maxBuyCardNum = this.data.maxBuyCardNum;
		if (num > 1) {
			num--;
		}
		var minusStatus = num <= 1 ? 'disabled' : 'normal';
		var plusStatus = num < maxBuyCardNum ? 'normal' : 'disabled';
		// 将数值与状态写回
		this.setData({
			num: num,
			minusStatus: minusStatus,
			plusStatus: plusStatus,
			totalPrice: num * 20
		});
	},
	/* 点击加号 */
	bindPlus: function() {
		var num = this.data.num;
		var maxBuyCardNum = this.data.maxBuyCardNum;
		if (num < maxBuyCardNum) {
			num++;
		};
		var maxBuyCardNumMinusOne = maxBuyCardNum-1;
		var minusStatus = num < 1 ? 'disabled' : 'normal';
		var plusStatus = num > maxBuyCardNumMinusOne ? 'disabled' : 'normal';

		this.setData({
			num: num,
			minusStatus: minusStatus,
			plusStatus: plusStatus,
			totalPrice: num * 20
		});
	},
	/* 输入框事件 */
	bindManual: function(e) {
		var num = e.detail.value;
		var maxBuyCardNum = this.data.maxBuyCardNum;
		if (num < 1) {
			num = 1;
			wx.showToast({
				title: '商品数量不能小于1',
				icon: 'none',
				duration: 2000
			});
		} else if (num > maxBuyCardNum) {
			num = maxBuyCardNum;
			wx.showToast({
				title: '商品数量不能大于' + maxBuyCardNum,
				icon: 'none',
				duration: 2000
			});
		};
		this.setData({
			num: num,
			totalPrice: num * 20
		});
	},
	//显示底部抽屉
	showModal: function() {
		// 显示遮罩层
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "linear",
			delay: 0
		});
		this.animation = animation;
		animation.translateY(700).step()
		this.setData({
			animationData: animation.export(),
			showModalStatus: true
		})
		setTimeout(function() {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export()
			})
		}.bind(this), 200)
	},
	//隐藏底部抽屉
	hideModal: function() {
		// 隐藏遮罩层
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateY(700).step()
		this.setData({
			animationData: animation.export(),
		})
		setTimeout(function() {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export(),
				showModalStatus: false
			})
		}.bind(this), 200)
	},
	//防止抽屉点透
	move: function() {},
	//协议选框
	checkChange: function(e) {
		this.setData({
			checkValue: !this.data.checkValue
		});
	},
	//协议弹窗
	hkscxy: function(e){
		console.log()
		this.setData({
			'xieyiStatus.showModelStatus': true
		});
	},
	//同意协议
	agree: function(e){
		this.setData({
			checkValue: true,
			'xieyiStatus.showModelStatus': false
		});
	},
	//不同意协议
	noAgree: function(e){
		this.setData({
			checkValue: false,
			'xieyiStatus.showModelStatus': false
		});
	},
	/*
	 **页面跳转区域
	 */
	//去购买
	goToBuy: function() {
		getApp().globalData.ywscOrderType = '3';
		//验证是否有收货地址
		var addressStatus = this.data.addressStatus;
		if (addressStatus == false) {
			wx.showToast({
				title: "请选择收货地址",
				icon: "none"
			})
			return false;
		};
		//验证是否有勾选协议
		var checkValue = this.data.checkValue;
		if (checkValue == false) {
			wx.showToast({
				title: "请阅读并同意《号卡商城购卡协议》",
				icon: "none"
			});
			return false;
		};

		wx.showLoading({
			mask: true,
			title: '正在提交订单...'
		});
		//验证购买数量
		var buyNum = this.data.num;
		var openId = app.globalData.payOpenId;
		wx.request({
			url: ajaxUrl + 'iCardServiceController.do?selectTime',
			method: 'POST',
			data: {
				openid: openId
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				console.log(res);
				//购买数量超额
				if (res.data[0].num < buyNum) {
					wx.hideLoading();
					this.setData({
						'tipsModelInfo.showModelStatus': true,
						'tipsModelInfo.title': '您今天还可购买' + res.data[0].num + '张'
					});
				} else {
					var iCardData = {
						identityName: '',
						identityCard: '',
						faceImage: '',
						backImage: '',
						handImage: '',
						openid: openId,
						user_name: this.data.addressData.contacts,
						phone: this.data.addressData.phonenumber,
						total_money: this.data.totalPrice,
						paid_money: this.data.totalPrice,
						num: buyNum,
						user_address: this.data.addressData.userAddress,
						ghxc: "2"
					};
					//验证身份信息
					var upadateIkgs = app.globalData.upadateIkgs;
					//关闭 0 打开 1
					if (upadateIkgs == 1) {
						wx.hideLoading();
						getApp().globalData.iCardData = iCardData;
						getApp().globalData.idcardbuynum = buyNum;
						wx.navigateTo({
							url: '../identifyId/identifyId'
						})
					} else {
						var that = this;
						//接收I卡订单信息接口
						wx.request({
							url: ajaxUrl + 'iCardServiceController.do?iCard',
							method: 'POST',
							data: iCardData,
							header: {
								"Content-Type": "application/x-www-form-urlencoded"
							},
							success: res => {
								//成功后 发起付款请求
								getApp().globalData.orderId = res.data[0].id;
								var payOpenId = app.globalData.payOpenId;
								var paidMoney = res.data[0].paidMoney;
								var orderNo = res.data[0].outTradeNo;

								util.wxPay(payOpenId, paidMoney, orderNo, that, '小程序远特i卡');
							},
							fail: err => {
								console.log(err);
								wx.hideLoading();
								that.setData({
									'tipsModelInfo.showModelStatus': true,
									'tipsModelInfo.title': '出错啦，请稍后再试~',
								});
							}
						});
					};
				}
			},
			fail: err => {
				console.log(err);
				wx.hideLoading();
				this.setData({
					'tipsModelInfo.showModelStatus': true,
					'tipsModelInfo.title': '出错啦，请稍后再试~',
				});
			}
		});
	},
	//隐藏提示信息和开卡指南弹窗
	goBackBtn: function(e) {
		this.setData({
			'tipsModelInfo.showModelStatus': false,
			'downModelInfo.showModelStatus': false
		});
	},
	/* 去地址操作页面 */
	chooseAddress: function(e) {
		wx.navigateTo({
			url: '../address/addressLists/addressLists'
		});
	},
	//开卡指南弹窗
	toKkznFun: function(e) {
		this.setData({
			'downModelInfo.showModelStatus': true
		})
	},
	//保存图片到手机
	saveImg: function() {
		var that = this, imgSrc = this.data.downModelInfo.appImgSrc;
		util.saveImgToPhotosAlbumTap(that, imgSrc);
	}
})
