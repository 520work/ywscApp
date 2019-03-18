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
		provinces: [],
		province: "",
		citys: [],
		city: "",
		countys: [],
		county: '',
		condition: false,
		noNum: false,
		checkValue: true,
		inputVal: ""
	},
	onLoad: function(options) {
		var that = this;
		var localCity = app.globalData.city;
		//查询城市信息 并初始化地址选择器
		wx.request({
			url: ajaxUrl + 'eCardServiceController.do?selectCity',
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function(res) {
				var cityData = res.data;
				var source = "queryData";
				util.initAddress(that, cityData, source);
				//根据用户所在城市 重置城市piker选项
				var cityDataArr = res.data;
				for (var i = 0; i < cityDataArr.length; i++) {
					var cityDataArrSon = cityDataArr[i].sub;
					for (var k = 0; k < cityDataArrSon.length; k++) {
						var cityArr = [];
						if (cityDataArrSon[k].name == localCity) {
							cityArr.push(cityDataArrSon[k].name);
							that.setData({
								value: [i, k, 0],
								values: [i, k],
								citys: cityArr,
								city: localCity,
								province: cityDataArr[i].name
							});
						}
					}
				};
			},
			fail: function(err) {
				console.log(err);
			}
		});
		// util.getUserLocation(that);
		var searchData = {
			cityId: localCity,
			findnum: ''
		}
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		that.getEcardList(searchData, 'onloadType');
		//地址显示
		var openId = app.globalData.openId;
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
					title: '加载收货地址失败，请稍后重试',
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
	/*
	 ** 接口功能
	 */
	//根据地址查询号段
	getEcardList: function(searchData, searchType) {
		this.setData({
			ecardData: []
		});
		wx.request({
			url: ajaxUrl + 'eCardServiceController.do?selectSectionNo',
			method: 'POST',
			data: searchData,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				wx.hideLoading();
				var ecardData = res.data;
				if (ecardData.length == 0) {
					if (searchType == 'onloadType') {
						wx.showToast({
							title: '当前城市无号段，正在为您切换为全国...',
							icon: 'none',
							duration: 3000
						});
						var searchData = {
							cityId: '全国',
							findnum: ''
						};
						this.setData({
							city: '全国',
							province: '全国',
							value: [0, 0, 0],
							values: [0, 0, 0]
						});
						this.getEcardList(searchData);
					} else {
						this.setData({
							noNum: true
						});
					}
				} else {
					this.setData({
						noNum: false
					});
					for (var i = 0; i < ecardData.length; i++) {
						ecardData[i].haoduanL = ecardData[i].sectionNo.slice(0, 3);
						ecardData[i].haoduanR = ecardData[i].sectionNo.slice(3, 7)
					};
					this.setData({
						ecardData: ecardData
					});
				}
			},
			fail: err => {
				wx.hideLoading();
				wx.showToast({
					title: '获取号段失败，请稍后再试。',
					icon: 'none',
					duration: 2000
				});
			}
		});
	},
	/*
	 ** 功能区域
	 */
	/* 点击减号 */
	bindMinus: function() {
		var num = this.data.num;
		if (num > 1) {
			num--;
		};
		var minusStatus = num <= 1 ? 'disabled' : 'normal'
		var plusStatus = num < 150 ? 'normal' : 'disabled';
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
		if (num < 150) {
			num++;
		}
		var minusStatus = num < 1 ? 'disabled' : 'normal';
		var plusStatus = num > 149 ? 'disabled' : 'normal';

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
		if (num < 1) {
			num = 1;
			wx.showToast({
				title: '商品数量不能小于1',
				icon: 'none',
				duration: 2000
			});
		} else if (num > 150) {
			num = 150;
			wx.showToast({
				title: '商品数量不能大于150',
				icon: 'none',
				duration: 2000
			});
		};
		this.setData({
			num: num
		});
	},
	//显示底部抽屉
	showModal: function(e) {
		var sectionNo = e.currentTarget.dataset.sectionno;
		var haoduanL = e.currentTarget.dataset.haoduanl;
		var haoduanR = e.currentTarget.dataset.haoduanr;
		var numberAttribution = e.currentTarget.dataset.city;
		this.setData({
			sectionNo: sectionNo,
			haoduanL: haoduanL,
			haoduanR: haoduanR,
			numberAttribution: numberAttribution
		});
		wx.showLoading({
			mask: true,
			title: '获取号段信息中'
		});
		//根据号段查询剩余卡数
		wx.request({
			url: ajaxUrl + 'eCardServiceController.do?sectionNumber',
			method: 'POST',
			data: {
				sectionNo: sectionNo
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				wx.hideLoading();
				var sectionNum = '还剩' + res.data[0].sl + '张,最多可买' + res.data[0].num + '张';
				this.setData({
					sectionNum: sectionNum
				});
			}
		});
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

	bindChange: util.bindChange,
	open: util.openAddressModel,
	input: function(e) {
		var regNum = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
		var nubmer = e.detail.value;
		if (!regNum.test(nubmer)) {
			this.setData({
				inputVal: ""
			});
			return false;
		}
		this.setData({
			inputVal: e.detail.value
		});
	},
	makeSure: function(e) {
		this.searchFun();
		this.setData({
			condition: !this.data.condition
		});
	},
	//搜索
	searchFun: function() {
		var newCity = this.data.city;
		var searchNumber = this.data.inputVal;
		var reg = /^[0-9]*$/;
		if (searchNumber) {
			if (searchNumber.length < 4 || !reg.test(searchNumber)) {
				wx.showToast({
					title: '请输入四位数字!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
		};
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		var searchData;
		if (searchNumber == undefined) {
			searchData = {
				cityId: newCity,
				findnum: ''
			};
		} else {
			searchData = {
				cityId: newCity,
				findnum: searchNumber
			};
		};
		this.getEcardList(searchData);
	},
	/*
	 **页面跳转区域
	 */
	//协议选框
	checkChange: function(e) {
		this.setData({
			checkValue: !this.data.checkValue
		});
	},
	//去购买
	goToPay: function(e) {
		var that = this;
		getApp().globalData.ywscOrderType = '4';
		//验证是否有收货地址
		var addressStatus = that.data.addressStatus;
		if (addressStatus == false) {
			wx.showToast({
				title: "请选择收货地址",
				icon: "none"
			})
			return false;
		};
		//验证是否有勾选协议
		var checkValue = that.data.checkValue;
		if (checkValue == false) {
			wx.showToast({
				title: "请阅读并同意《远微商城购卡协议》",
				icon: "none"
			});
			return false;
		};
		wx.showLoading({
			mask: true,
			title: '正在提交订单...'
		});
		//验证可购买数量
		var sectionNo = that.data.sectionNo;
		var sectionNumberData = {
			sectionNo: sectionNo
		};
		wx.request({
			url: ajaxUrl + 'eCardServiceController.do?sectionNumber',
			method: 'POST',
			data: sectionNumberData,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				console.log(res);
				//售罄
				if (res.data[0].num == 0) {
					wx.hideLoading();
					that.setData({
						'sellModelInfo.showModelStatus': true,
						'sellModelInfo.sellout': true,
						'sellModelInfo.text1': '您选择的号段由于太抢手',
						'sellModelInfo.text2': '已经售完啦(〒︿〒)',
						'sellModelInfo.text3': '您可以返回继续选择其他号段( ^ω^)'
					});
				} else {
					//余量不足
					var buyNum = that.data.num;
					var openId = app.globalData.openId;
					if (buyNum > res.data[0].num) {
						wx.hideLoading();
						that.setData({
							'sellModelInfo.showModelStatus': true,
							'sellModelInfo.sellout': false,
							'sellModelInfo.text1': '您选择的号段由于太抢手',
							'sellModelInfo.text2': '导致余量不足(〒︿〒)',
							'sellModelInfo.text3': '您可以返回重新查询号段信息( ^ω^)'
						});
					} else {
						wx.request({
							url: ajaxUrl + 'eCardServiceController.do?selectETime',
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
									that.setData({
										'tipsModelInfo.showModelStatus': true,
										'tipsModelInfo.title': '您今天还可购买' + res.data[0].num + '张'
									});
								} else {
									var eCardData = {
										numberAttribution: that.data.numberAttribution,
										sectionNo: sectionNo,
										identityName: '',
										identityCard: '',
										faceImage: '',
										backImage: '',
										handImage: '',
										openid: openId,
										num: buyNum,
										user_name: that.data.addressData.contacts,
										phone: that.data.addressData.phonenumber,
										user_address: that.data.addressData.userAddress,
										total_money: that.data.totalPrice,
										paid_money: that.data.totalPrice
									};
									//验证身份信息
									var upadateKg = app.globalData.upadateKg;
									//关闭 0 打开 1
									if (upadateKg == 1) {
										getApp().globalData.idcardbuynum = buyNum;
										getApp().globalData.eCardData = eCardData;
										wx.navigateTo({
											url: '../identifyId/identifyId'
										})
									} else {
										//接收E卡订单信息接口
										wx.request({
											url: ajaxUrl + 'eCardServiceController.do?eCard',
											method: 'POST',
											data: eCardData,
											header: {
												"Content-Type": "application/x-www-form-urlencoded"
											},
											success: res => {
												wx.hideLoading();
												getApp().globalData.orderId = res.data[0].id;
												//成功后 发起付款请求
												var payOpenId = app.globalData.payOpenId;
												var paidMoney = res.data[0].paidMoney;
												var orderNo = res.data[0].outTradeNo;
												
												util.wxPay(payOpenId, paidMoney, orderNo, that, '小程序远特e卡');
											},
											fail: err => {
												console.log(err);
												that.setData({
													'tipsModelInfo.showModelStatus': '出错啦，请稍后再试~',
													'tipsModelInfo.title': true,
												});
											}
										});
									};
								}
							},
							fail: err => {
								console.log(err);
								that.setData({
									'tipsModelInfo.showModelStatus': '出错啦，请稍后再试~',
									'tipsModelInfo.title': true,
								});
							}
						});
					}
				}
			},
			fail: err => {
				console.log(err);
				that.setData({
					'tipsModelInfo.showModelStatus': '出错啦，请稍后再试~',
					'tipsModelInfo.title': true,
				});
			}
		});
	},
	//隐藏提示信息弹窗
	goBackBtn: function(e) {
		this.setData({
			'sellModelInfo.showModelStatus': false,
			'sellModelInfo.sellout': false,
			'tipsModelInfo.showModelStatus': false
		});
	},
	/* 去地址操作页面 */
	chooseAddress: function(e) {
		wx.navigateTo({
			url: '../address/addressLists/addressLists'
		});
	}
})
