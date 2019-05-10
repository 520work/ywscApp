var app = getApp();
var util = require('../../utils/util.js');
var dataBase = require('../../utils/database.js');
var ajaxUrl = util.ajaxUrl;
Page({
	data: {
		yyid: 0,
		llid: 0,
		zzid: 0,
		hfid: 0,
		checkValue: true,
		yhqCode: '',
		tipsModelInfo: {
			title: '',
			btn: '确定',
			showModelStatus: false
		},
		bwcShow: false
	},
	//生命周期函数--监听页面加载
	onLoad: function(options) {
		var that = this;
		var openId = app.globalData.payOpenId;
		if (options.dataCode != '') {
			that.setData({
				dataCode: options.dataCode,
				fromYztc: true
			});
		};
		var upadateKg = app.globalData.upadateKg;
		if (upadateKg == 0) {
			that.setData({
				showPrice: true,
				payText: '立即支付'
			});
		} else {
			that.setData({
				showPrice: false,
				payText: '下一步'
			});
		};
		//判断用户来源
		var haokaType;
		if (options.tmType != 'undefined') {
			//五一活动 begin
			that.setData({
				fromBytm: true
			});
			//五一活动 end
			//特卖过来的用户 分辨靓号和情侣号
			if (options.tmType == 'lhtm') {
				that.setData({
					fromLhtm: true
				});
				haokaType = 3;
			} else {
				that.setData({
					fromLhtm: false
				});
				haokaType = 4;
			};
		} else {
			//分辨号码直选和优质套餐
			if (options.dataCode != '') {
				haokaType = 2;
			} else {
				haokaType = 1;
			};
		};
		//获取URL传递过来的参数 并显示在套餐页面顶部
		var doubleNumStatus = options.doubleNumStatus;
		that.setData({
			doubleNumStatus: doubleNumStatus,
			haokaType: haokaType
		});
		var whereFrom = options.whereFrom;
		getApp().globalData.guishudi = whereFrom;
		var occupyMoney = that.keepTwoFloor(options.occupyMoney);
		if (doubleNumStatus == "true") {
			var qlTelNum = options.qlTelNum.slice(0, 3) + ' ' + options.qlTelNum.slice(3, 7) + ' ' + options.qlTelNum.slice(7,
				11);
			var qlTelNum1 = options.qlTelNum1.slice(0, 3) + ' ' + options.qlTelNum1.slice(3, 7) + ' ' + options.qlTelNum1.slice(
				7, 11);
			that.setData({
				doubleNumStatus: true,
				qlTelNum: qlTelNum,
				qlTelNum1: qlTelNum1,
				whereFrom: whereFrom,
				occupyMoney: occupyMoney
			});
			getApp().globalData.idcardbuynum = '2';
		} else {
			var telNum = options.telNum.slice(0, 3) + ' ' + options.telNum.slice(3, 7) + ' ' + options.telNum.slice(7,
				11);
			that.setData({
				llNumStatus: true,
				telNum: telNum,
				whereFrom: whereFrom,
				occupyMoney: occupyMoney
			});
			getApp().globalData.idcardbuynum = '1';
		};
		//优惠券获取
		var saleType = options.sale;
		if (saleType != 'tm') {
			// 			wx.showLoading({
			// 				mask: true,
			// 				title: '优惠券加载中'
			// 			});
			var phoneNum = that.data.telNum.replace(/\s+/g, "");
			that.yhqInfo(that, phoneNum, openId, doubleNumStatus, options, whereFrom, occupyMoney);
		} else {
			that.setData({
				yhqCode: '',
				yhje: '0.00'
			});
			//获取套餐信息
			var fromLhtm = that.data.fromLhtm;
			that.getTaocanInfo(that, fromLhtm, doubleNumStatus, options, whereFrom, occupyMoney);
		};
		//地址显示
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
			}
		});
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
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
	//语音资费选择
	yuyinSelFun: function(e) {
		var ids = e.currentTarget.dataset.id;
		var basicPackageLists = this.data.basicPackageLists;
		//切换流量档位信息
		var liuliangData = [];
		var defaultPackage = basicPackageLists[ids];
		if (defaultPackage.PackageList.length <= 1) {
			var liuliangInfo = defaultPackage.PackageList[0].title;
			if (liuliangInfo.indexOf('<br/>') < 0) {
				liuliangData[0] = {};
				liuliangData[0].name = defaultPackage.PackageList[0].title; //标题
				liuliangData[0].price = false; //价格
			} else {
				var lltitle = liuliangTitle.split("<br/>");
				liuliangData[0] = {};
				liuliangData[0].name = lltitle[0]; //标题
				liuliangData[0].price = lltitle[1]; //价格
			};
			liuliangData[0].package_name = defaultPackage.PackageList[0].package_name;
			liuliangData[0].code = defaultPackage.PackageList[0].code;
			liuliangData[0].fee_describe = defaultPackage.PackageList[0].fee_describe;
			//五一活动 begin
			var huodongValid = app.globalData.huodongValid;
			if(huodongValid){
				if (liuliangData[0].code == "1353243" || liuliangData[0].code == "1353242") {
					liuliangData[0].showBwc = true
				};
			}
			//五一活动 end
		} else {
			for (var i = 0; i < defaultPackage.PackageList.length; i++) {
				var liuliangInfo = defaultPackage.PackageList[i].title;
				if (liuliangInfo.indexOf('<br/>') < 0) {
					liuliangData[i] = {};
					liuliangData[i].name = liuliangInfo; //标题
					liuliangData[i].price = false; //价格
				} else {
					var lltitle = liuliangInfo.split("<br/>");
					liuliangData[i] = {};
					liuliangData[i].name = lltitle[0]; //标题
					liuliangData[i].price = lltitle[1]; //价格
				};
				liuliangData[i].package_name = defaultPackage.PackageList[i].package_name;
				liuliangData[i].code = defaultPackage.PackageList[i].code;
				liuliangData[i].fee_describe = defaultPackage.PackageList[i].fee_describe;
				//五一活动 begin
				var huodongValid = app.globalData.huodongValid;
				if(huodongValid){
					if (liuliangData[i].code == "1353243" || liuliangData[i].code == "1353242") {
						liuliangData[i].showBwc = true
					};
				};
				//五一活动 end
			};

		};
		//切换资费说明信息
		var zifeiData = basicPackageLists[ids].PackageList[0].standard;
		//切换增值业务信息
		var zengzhiData = [];
		for (var i = 0; i < basicPackageLists[ids].PackageList[0].Optional_package.length; i++) {
			if (basicPackageLists[ids].PackageList[0].Optional_package[i].code != "000000") {
				zengzhiData.push(basicPackageLists[ids].PackageList[0].Optional_package[i])
			}
		};
		// var zengzhiData = basicPackageLists[ids].PackageList[0].Optional_package;
		//处理增值业务默认选项逻辑
		for (var i = 0; i < zengzhiData.length; i++) {
			if (zengzhiData[i].necessary == 2) {
				zengzhiData[i].isBiXuan = true;
				zengzhiData[i].isDefault = true;
			} else if (zengzhiData[i].necessary == 1) {
				zengzhiData[i].isDefault = true;
			} else {
				zengzhiData[i].isDefault = false;
			};
		};
		//切换预存话费信息
		if (this.data.fromLhtm == true) {
			var yucunData = [5000];
		} else {
			// var yucunData = basicPackageLists[ids].PackageList[0].deposit_money;
			//五一活动 begin
			var huodongValid = app.globalData.huodongValid;
			if(huodongValid){
				if(ids == 2){
					var yucunData =[];
					var despositM = basicPackageLists[ids].PackageList[0].deposit_money;
					for (var i = 0; i < despositM.length; i++) {
						if (despositM[i] != 10000) {
							yucunData.push(despositM[i]);
						};
					};
				} else {
					var yucunData = basicPackageLists[ids].PackageList[0].deposit_money;
				};
			}else{
				var yucunData = basicPackageLists[ids].PackageList[0].deposit_money;
			};
			//五一活动 end
		};
		var fromQlhao = this.data.doubleNumStatus;
		var yucunjine = Number(yucunData[0] / 100).toFixed(2);
		var occupyMoney = this.data.occupyMoney;
		if (fromQlhao == true) {
			var orderTotal = this.keepTwoFloor(Number(occupyMoney) + Number(yucunjine) * 2); //订单总计
			var payMoney = this.keepTwoFloor(orderTotal - Number(this.data.yhje)); //实付金额
		} else {
			var orderTotal = this.keepTwoFloor(Number(occupyMoney) + Number(yucunjine)); //订单总计
			var payMoney = this.keepTwoFloor(orderTotal - Number(this.data.yhje)); //实付金额
		};
		this.setData({
			yyid: ids,
			llid: 0,
			hfid: 0,
			liuliangData: liuliangData,
			'orderQueryData.phone_package': liuliangData[0].package_name,
			'orderQueryData.productId': liuliangData[0].code,
			zifeiData: zifeiData,
			zengzhiData: zengzhiData,
			yucunData: yucunData,
			yucunjine: yucunjine,
			orderTotal: orderTotal,
			payMoney: payMoney
		})
	},
	//流量选择
	liuliangSelFun: function(e) {
		var ids = e.currentTarget.dataset.id;
		var yyid = this.data.yyid;
		var liuliangPackage = this.data.basicPackageLists[yyid].PackageList[ids];
		//切换资费说明信息
		var zifeiData = liuliangPackage.standard;
		//切换增值业务信息
		var zengzhiData = [];
		for (var i = 0; i < liuliangPackage.Optional_package.length; i++) {
			if (liuliangPackage.Optional_package[i].code != "000000") {
				zengzhiData.push(liuliangPackage.Optional_package[i]);
			}
		};
		// var zengzhiData = liuliangPackage.Optional_package;
		//处理增值业务默认选项逻辑
		for (var i = 0; i < zengzhiData.length; i++) {
			if (zengzhiData[i].necessary == 2) {
				zengzhiData[i].isBiXuan = true;
				zengzhiData[i].isDefault = true;
			} else if (zengzhiData[i].necessary == 1) {
				zengzhiData[i].isDefault = true;
			} else {
				zengzhiData[i].isDefault = false;
			};
		};
		//切换预存话费信息
		if (this.data.fromLhtm == true) {
			var yucunData = [5000];
		} else {
			// var yucunData = liuliangPackage.deposit_money;
			//五一活动 begin
			var huodongValid = app.globalData.huodongValid;
			if(huodongValid){
				if(liuliangPackage.code == "1353243"){
					var yucunData =[];
					var despositM = liuliangPackage.deposit_money;
					for (var i = 0; i < despositM.length; i++) {
						if (despositM[i] != 10000) {
							yucunData.push(despositM[i]);
						};
					};
				} else {
					var yucunData = liuliangPackage.deposit_money;
				};
			} else {
				var yucunData = liuliangPackage.deposit_money;
			};
			//五一活动 end
		};
		var fromQlhao = this.data.doubleNumStatus;
		var yucunjine = Number(yucunData[0] / 100).toFixed(2);
		var occupyMoney = this.data.occupyMoney;
		if (fromQlhao == true) {
			var orderTotal = this.keepTwoFloor(Number(occupyMoney) + Number(yucunjine) * 2);
			var payMoney = this.keepTwoFloor(orderTotal - Number(this.data.yhje));
		} else {
			var orderTotal = this.keepTwoFloor(Number(occupyMoney) + Number(yucunjine));
			var payMoney = this.keepTwoFloor(orderTotal - Number(this.data.yhje));
		};
		this.setData({
			llid: ids,
			'orderQueryData.phone_package': liuliangPackage.package_name,
			'orderQueryData.productId': liuliangPackage.code,
			zifeiData: zifeiData,
			zengzhiData: zengzhiData,
			yucunData: yucunData,
			yucunjine: yucunjine,
			orderTotal: orderTotal,
			payMoney: payMoney
		})
	},
	//增值业务选择
	zzywSelFun: function(e) {
		var ids = e.currentTarget.dataset.id;
		var yyid = this.data.yyid;
		var llid = this.data.llid;
		var zengzhiItem = this.data.zengzhiData[ids];
		var zengzhiItems = this.data.zengzhiData;
		var zfsmArr = zengzhiItem.fee_describe.split('<br/>');
		var rej = zengzhiItem.relevant_opt_package.slice(0, 7);
		var isBiXuan = zengzhiItem.isBiXuan;
		var isDefault = zengzhiItem.isDefault;
		var chooseBtnText, chooseStatus, chooseBtnStatus;
		if (isBiXuan) {
			chooseBtnStatus = false;
			chooseBtnText = '不显示';
			chooseStatus = '';
		} else {
			if (rej != '') { //有互斥
				if (isDefault) {
					//选中状态
					chooseBtnText = '不选择';
					chooseBtnStatus = true;
					chooseStatus = false;
				} else {
					//未选中状态 先判断互斥项是否被选中
					for (var i = 0; i < zengzhiItems.length; i++) {
						if (zengzhiItems[i].code == rej) {
							if (zengzhiItems[i].isDefault) {
								//互斥项已选中
								chooseBtnStatus = false;
								chooseBtnText = '不显示';
								chooseStatus = '';
							} else {
								//互斥项未选中
								chooseBtnText = '选择';
								chooseBtnStatus = true;
								chooseStatus = true;
							}
						}
					}
				}
			} else {
				//无互斥
				if (isDefault) {
					//选中状态
					chooseBtnText = '不选择';
					chooseBtnStatus = true;
					chooseStatus = false;
				} else {
					//未选中状态
					chooseBtnText = '选择'
					chooseBtnStatus = true;
					chooseStatus = true;
				}
			};
		};
		this.setData({
			'tcModelInfo.chooseBtnText': chooseBtnText,
			'tcModelInfo.chooseBtnStatus': chooseBtnStatus,
			'tcModelInfo.showModelStatus': true,
			'tcModelInfo.title': zengzhiItem.package_name,
			'tcModelInfo.standard': zengzhiItem.standard,
			'tcModelInfo.fee_describe': zfsmArr,
			'tcModelInfo.chooseStatus': chooseStatus,
			zzid: ids
		})
	},
	//预存话费
	ychfSelFun: function(e) {
		var ids = e.currentTarget.dataset.id;
		var fromQlhao = this.data.doubleNumStatus;
		var yucunjine = Number(e.currentTarget.dataset.yucun).toFixed(2);
		var occupyMoney = this.data.occupyMoney;
		if (fromQlhao == true) {
			var orderTotal = this.keepTwoFloor(Number(occupyMoney) + Number(yucunjine) * 2);
			var payMoney = this.keepTwoFloor(orderTotal - Number(this.data.yhje));
		} else {
			var orderTotal = this.keepTwoFloor(Number(occupyMoney) + Number(yucunjine));
			var payMoney = this.keepTwoFloor(orderTotal - Number(this.data.yhje));
		};
		this.setData({
			hfid: ids,
			yucunjine: yucunjine,
			orderTotal: orderTotal,
			payMoney: payMoney
		})
	},
	//打开优惠券抽屉
	chooseCoupon: function() {
		var animation = wx.createAnimation({
			duration: 1000,
			delay: 0,
			timingFunction: "ease",
		});
		var moveWidth = wx.getSystemInfoSync().windowWidth
		animation.translate((-moveWidth), 0).step({
			duration: 1000
		})
		this.setData({
			moveData: animation.export()
		});
	},
	//关闭优惠券抽屉
	hide: function() {
		var animation = wx.createAnimation({
			duration: 1000,
			delay: 0,
			timingFunction: "ease",
		});
		var moveWidth = wx.getSystemInfoSync().windowWidth
		animation.translate((moveWidth), 0).step({
			duration: 1000
		})
		this.setData({
			moveData: animation.export()
		})
	},
	//防止抽屉点透
	move: function() {},
	//不使用优惠券
	noUseCoupon: function(e) {
		this.hide();
		this.setData({
			yhqCode: '',
			yhje: '0.00'
		});
	},
	//点击优惠券
	useCoupon: function(e) {
		var discount = e.currentTarget.dataset.discount;
		var yhqCode = e.currentTarget.dataset.yhqcode;
		var hmzyf = this.data.occupyMoney; //号码占用费
		var yhje = this.keepTwoFloor(hmzyf * (1 - discount));
		this.setData({
			yhje: yhje,
			yhqCode: yhqCode
		});
		this.hide();
	},
	//禁用优惠券
	yhqInfo: function(that, phoneNum, openId, doubleNumStatus, options, whereFrom, occupyMoney) {
		that.setData({
			noCoupon: true,
			yhqCode: '',
			yhje: '0.00'
		});
		var fromLhtm = that.data.fromLhtm;
		that.getTaocanInfo(that, fromLhtm, doubleNumStatus, options, whereFrom, occupyMoney);
	},
	//优惠券接口
	// 	yhqInfo: function(that, phoneNum, openId, doubleNumStatus, options, whereFrom, occupyMoney) {
	// 		wx.request({
	// 			url: ajaxUrl + 'xborderCardServiceController.do?xbyhqInfo',
	// 			method: 'POST',
	// 			data: {
	// 				phone_number: phoneNum,
	// 				openid: openId
	// 			},
	// 			header: {
	// 				"Content-Type": "application/x-www-form-urlencoded"
	// 			},
	// 			success: function(res) {
	// 				wx.hideLoading();
	// 				var canUseCouArr = [];
	// 				if (res.data.length == 0) {
	// 					that.setData({
	// 						noCoupon: true,
	// 						yhqCode: '',
	// 						yhje: '0.00'
	// 					});
	// 				} else {
	// 					var couData = res.data;
	// 					for (var i = 0; i < couData.length; i++) {
	// 						if (couData[i].usingState == '0') {
	// 							canUseCouArr.push(couData[i]);
	// 						};
	// 					};
	// 					//默认优惠券
	// 					if (canUseCouArr.length > 0) {
	// 						var hmzyf = that.data.occupyMoney; //号码占用费
	// 						var discount = canUseCouArr[0].faceValue / 1000; //折扣
	// 						var yhje = that.keepTwoFloor(hmzyf * (1 - discount));
	// 						var yhqCode = canUseCouArr[0].ticketCode;
	// 					} else {
	// 						var yhje = '0.00';
	// 						var yhqCode = '';
	// 					};
	// 					that.setData({
	// 						canUseCoupon: canUseCouArr,
	// 						yhje: yhje,
	// 						yhqCode: yhqCode
	// 					});
	// 				};
	// 				that.getTaocanInfo(that, doubleNumStatus, options, whereFrom, occupyMoney);
	// 			},
	// 			fail: function(err) {
	// 				console.log(err);
	// 				wx.showToast({
	// 					title: '优惠券获取失败，请稍后再试。',
	// 					icon: 'none',
	// 					duration: 2000
	// 				});
	// 			}
	// 		});
	// 	},
	//请求套餐数据
	getTaocanInfo: function(that, fromLhtm, doubleNumStatus, options, whereFrom, occupyMoney) {
		if (fromLhtm == true) {
			that.taocanOptions(that, dataBase.lhtcData.Content.BasicPackageList, occupyMoney);
		} else if (doubleNumStatus == "true") {
			that.taocanOptions(that, dataBase.qinglvData.Content.BasicPackageList, occupyMoney);
		} else {
			//发起获取当前号码套餐信息的请求
			wx.showLoading({
				mask: true,
				title: '套餐加载中'
			});
			var phoneNum = options.telNum;
			wx.request({
				url: 'https://www.m10027.com/ecard/phoneController/getPackageByPhone5',
				method: 'POST',
				data: {
					phone: phoneNum
				},
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: function(res) {
					wx.hideLoading();
					if (res.data.code == 201) {
						console.log("未查询到该号码信息");
					} else {
						if (res.statusCode == 500 || res.statusCode == 404) {
							wx.showModal({
								title: '提示',
								content: '套餐查询失败，请稍后重试',
								showCancel: false,
								success(res) {
									if (res.confirm) {
										console.log('用户点击确定')
									} else if (res.cancel) {
										console.log('用户点击取消')
									}
								}
							})
						} else {
							var listsData = res.data.Content.BasicPackageList;
							that.taocanOptions(that, listsData, occupyMoney);
						}
					};
				},
				fail: function(err) {
					console.log(err);
				}
			});
		};
	},
	//对请求来的套餐选项进行初始化操作
	taocanOptions: function(that, data, occupyMoney) {
		var packageTitle = [];
		var liuliangData = [];
		var zifeiData;
		var zengzhiData = [];
		var yucunData;
		var yucunjine;
		//判断用户进入号板来源 如果是优质套餐dataCode会有值 如果是号码直选则为undefined
		if (that.data.dataCode == undefined) {
			//语音资费信息
			for (var i = 0; i < data.length; i++) {
				var packageInfo = data[i].PackageTitle;
				var npinfo = packageInfo.split("<br/>");
				packageTitle[i] = {};
				packageTitle[i].name = npinfo[0];
				packageTitle[i].price = npinfo[1];
				//五一活动 begin
				var huodongValid = app.globalData.huodongValid;
				if(huodongValid){
					if(!this.data.fromBytm){
						if (packageTitle[i].name == "无限时空系列") {
							packageTitle[i].showBwc = true
						};
					};
				};
				//五一活动 end
			};
			//默认 流量档位信息
			var defaultPackage = data[0];
			if (defaultPackage.PackageList.length <= 1) {
				var liuliangInfo = defaultPackage.PackageList[0].title;
				if (liuliangInfo.indexOf('<br/>') < 0) {
					liuliangData[0] = {};
					liuliangData[0].name = defaultPackage.PackageList[0].title; //标题
					liuliangData[0].price = false; //价格
				} else {
					var lltitle = liuliangTitle.split("<br/>");
					liuliangData[0] = {};
					liuliangData[0].name = lltitle[0]; //标题
					liuliangData[0].price = lltitle[1]; //价格
				};
				liuliangData[0].package_name = defaultPackage.PackageList[0].package_name;
				liuliangData[0].code = defaultPackage.PackageList[0].code;
				liuliangData[0].fee_describe = defaultPackage.PackageList[0].fee_describe;
				//五一活动 begin
				var huodongValid = app.globalData.huodongValid;
				if(huodongValid){
					if (liuliangData[0].code == "1353243" || liuliangData[0].code == "1353242") {
						liuliangData[0].showBwc = true
					};
				};
				//五一活动 end
			} else {
				for (var i = 0; i < defaultPackage.PackageList.length; i++) {
					var liuliangInfo = defaultPackage.PackageList[i].title;
					if (liuliangInfo.indexOf('<br/>') < 0) {
						liuliangData[i] = {};
						liuliangData[i].name = liuliangInfo; //标题
						liuliangData[i].price = false; //价格
					} else {
						var lltitle = liuliangInfo.split("<br/>");
						liuliangData[i] = {};
						liuliangData[i].name = lltitle[0]; //标题
						liuliangData[i].price = lltitle[1]; //价格
					};
					liuliangData[i].package_name = defaultPackage.PackageList[i].package_name;
					liuliangData[i].code = defaultPackage.PackageList[i].code;
					liuliangData[i].fee_describe = defaultPackage.PackageList[i].fee_describe;
				};
			};
			//默认 资费说明信息
			zifeiData = data[0].PackageList[0].standard;
			//默认 增值业务信息
			for (var i = 0; i < data[0].PackageList[0].Optional_package.length; i++) {
				if (data[0].PackageList[0].Optional_package[i].code != "000000") {
					zengzhiData.push(data[0].PackageList[0].Optional_package[i])
				}
			}
			// zengzhiData = data[0].PackageList[0].Optional_package;
			//默认 预存话费信息
			if (this.data.fromLhtm == true) {
				yucunData = [5000];
			} else {
				yucunData = data[0].PackageList[0].deposit_money;
			};
			var yucunjine = Number(yucunData[0] / 100).toFixed(2);
		} else {
			for (var i = 0; i < data.length; i++) {
				var dataSon = data[i].PackageList;
				for (var k = 0; k < dataSon.length; k++) {
					if (dataSon[k].code == that.data.dataCode) {
						//语音资费信息
						var packageInfo = dataSon[k].package_name;
						var npinfo = packageInfo.split("<br/>");
						packageTitle[0] = {};
						if (that.data.dataCode == '1353242') {
							packageTitle[0].name = '流量不限用';
						} else {
							packageTitle[0].name = npinfo[0];
						};
						packageTitle[0].price = npinfo[1];
						//重置liuliangData
						liuliangData[0] = {};
						liuliangData[0].package_name = packageInfo;
						liuliangData[0].code = that.data.dataCode;
						liuliangData[0].fee_describe = dataSon[k].fee_describe;
						//默认 资费说明信息
						zifeiData = dataSon[k].standard;
						//默认 增值业务信息
						for (var i = 0; i < dataSon[k].Optional_package.length; i++) {
							if (dataSon[k].Optional_package[i].code != "000000") {
								zengzhiData.push(dataSon[k].Optional_package[i])
							}
						}
						// zengzhiData = dataSon[k].Optional_package;
						//默认 预存话费信息
						if (this.data.fromLhtm == true) {
							yucunData = [5000];
						} else {
							//yucunData = dataSon[k].deposit_money;
							//五一活动 begin
							var huodongValid = app.globalData.huodongValid;
							if(huodongValid){
								var yucunData =[];
								var despositM = dataSon[k].deposit_money;
								for (var i = 0; i < despositM.length; i++) {
									if (despositM[i] != 10000) {
										yucunData.push(despositM[i]);
									};
								};
							} else {
								yucunData = dataSon[k].deposit_money;
							};
							//五一活动 end
						};
						var yucunjine = Number(yucunData[0] / 100).toFixed(2);
					};
				};
			};
		};
		var fromQlhao = this.data.doubleNumStatus;
		if (fromQlhao == true) {
			var orderTotal = that.keepTwoFloor(Number(occupyMoney) + Number(yucunjine) * 2); //订单总计
			var payMoney = that.keepTwoFloor(orderTotal - Number(that.data.yhje));
		} else {
			var orderTotal = that.keepTwoFloor(Number(occupyMoney) + Number(yucunjine)); //订单总计
			var payMoney = that.keepTwoFloor(orderTotal - Number(that.data.yhje));
		}
		//处理增值业务默认选项逻辑
		for (var i = 0; i < zengzhiData.length; i++) {
			if (zengzhiData[i].necessary == 2) {
				zengzhiData[i].isBiXuan = true;
				zengzhiData[i].isDefault = true;
			} else if (zengzhiData[i].necessary == 1) {
				zengzhiData[i].isDefault = true;
			} else {
				zengzhiData[i].isDefault = false;
			};
		};
		that.setData({
			yuyinData: packageTitle,
			liuliangData: liuliangData,
			zifeiData: zifeiData,
			zengzhiData: zengzhiData,
			yucunData: yucunData,
			yucunjine: yucunjine,
			basicPackageLists: data,
			orderTotal: orderTotal,
			payMoney: payMoney
		});
	},
	//去支付
	goToPay: function(e) {
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
				title: "请阅读并同意《远微商城购卡协议》",
				icon: "none"
			});
			return false;
		};
		//判断号码是否可买
		var ctQueryData;
		if (this.data.doubleNumStatus) {
			var qlTelNum = this.data.qlTelNum.replace(/\s+/g, "");
			var qlTelNum1 = this.data.qlTelNum1.replace(/\s+/g, "");
			ctQueryData = qlTelNum + ',' + qlTelNum1;
		} else {
			var telNum = this.data.telNum.replace(/\s+/g, "");
			ctQueryData = telNum;
		};
		wx.showLoading({
			mask: true,
			title: '加载中...'
		});
		wx.request({
			url: ajaxUrl + 'zbCardServiceController.do?cardType',
			method: 'POST',
			data: {
				phone_number: ctQueryData
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				if (res.data[0].sell_state == '0') {
					//可卖
					var numberType = res.data[0].numberType;
					if (numberType == '0') {
						numberType = '情侣号'
					} else if (numberType == '1') {
						numberType = '普号'
					} else if (numberType == '2') {
						numberType = '靓号'
					};
					if (this.data.doubleNumStatus) {
						var num = this.data.qlTelNum.replace(/\s+/g, "");
					} else {
						var num = this.data.telNum.replace(/\s+/g, "");
					};
					var incrementArr = [],
						incrementIdArr = [],
						increment, incrementId;
					for (var i = 0; i < this.data.zengzhiData.length; i++) {
						var zzItem = this.data.zengzhiData[i];
						if (zzItem.isDefault == true) {
							incrementArr.push(zzItem.package_name);
							incrementIdArr.push(zzItem.code);
						}
					}
					increment = incrementArr.toString();
					incrementId = incrementIdArr.toString();
					//下单请求参数体
					var fromQlhao = this.data.doubleNumStatus;
					if (fromQlhao == true) {
						var preDeposit = this.data.yucunData[this.data.hfid] / 100 * 2;
					} else {
						var preDeposit = this.data.yucunData[this.data.hfid] / 100;
					};
					var orderQueryData = {
						"identityName": "",
						"identityCard": "",
						"faceImage": "",
						"backImage": "",
						"handImage": "",
						"openid": app.globalData.payOpenId,
						"numberType": numberType, //号码类型
						"occupyMoney": Number(this.data.occupyMoney), //占用费
						"phone_number": num, //卡号
						"city": this.data.whereFrom, //卡号城市
						"phone_package": this.data.liuliangData[this.data.llid].package_name, //套餐名
						"productId": this.data.liuliangData[this.data.llid].code, //套餐id
						"increment": increment, //增值业务名
						"incrementId": incrementId, //增值业务id
						"pre_deposit": preDeposit, //预存
						"yhqCode": this.data.yhqCode,
						"total_money": this.data.orderTotal, //总计
						"paid_money": this.data.orderTotal, //实付
						"user_name": this.data.addressData.contacts, //收货人姓名
						"phone": this.data.addressData.phonenumber, //收货人电话
						"user_address": this.data.addressData.userAddress, //收货人地址
						"haokaType": this.data.haokaType ,//1号码直选，2优质套餐，3特卖靓号，4特卖情侣号，
						"ghxc": "2"
					};
					//开关判断
					var upadateKg = app.globalData.upadateKg;
					//关闭 0 打开 1
					if (upadateKg == 1) {
						wx.hideLoading();
						//传递参数
						getApp().globalData.orderQueryData = orderQueryData;
						wx.navigateTo({
							url: '../identifyId/identifyId'
						});
					} else {
						//下单 判断金额
						wx.request({
							url: ajaxUrl + 'xborderCardServiceController.do?xborderCard',
							method: 'POST',
							data: orderQueryData,
							header: {
								"Content-Type": "application/x-www-form-urlencoded"
							},
							success: res => {
								getApp().globalData.orderId = res.data[0].id;
								if (res.data[0].preDeposit == '-1') {
									this.setData({
										'tipsModelInfo.title': '您的预存与实际不符，请重新选择',
										'tipsModelInfo.showModelStatus': true
									});
								} else {
									if (res.data[0].discountMoney == '0') {
										getApp().globalData.yufu = false;
										//调用付款接口
										var payOpenId = app.globalData.payOpenId,
											paidMoney = res.data[0].paidMoney,
											orderNo = res.data[0].outTradeNo;
										var that = this;
										util.wxPay(payOpenId, paidMoney, orderNo, that, '小程序号卡商城');
									} else {
										//支付金额大于3000 付定金
										getApp().globalData.yufu = true;
										wx.navigateTo({
											url: '../pay/payAbovePause/pap?payOpenId=' + app.globalData.payOpenId + '&orderNo=' + res.data[
													0].outTradeNo + '&phoneNumber=' + res.data[0].phoneNumber + '&phoneNumber1=' + res.data[0].phoneNumber1 +
												'&city=' + res.data[0].city + '&occupyMoney=' + res.data[0].occupyMoney + '&preDeposit=' + res.data[
													0].preDeposit + '&yhMoney=' + res.data[0].yhMoney + '&discountMoney=' + res.data[0].discountMoney +
												'&paidMoney=' + res.data[0].paidMoney
										})
									};
								};
							},
							fail: err => {
								console.log(err);
								wx.hideLoading();
								this.setData({
									'tipsModelInfo.title': '出错啦，请稍后再试~',
									'tipsModelInfo.showModelStatus': true
								});
							}
						});
					};
				} else {
					wx.hideLoading();
					this.setData({
						'tipsModelInfo.title': '手慢了一步，被别人抢先了，再去看看别的吧~',
						'tipsModelInfo.showModelStatus': true
					});
				};
			},
			fail: err => {
				console.log(err);
				wx.hideLoading();
				this.setData({
					'tipsModelInfo.title': '出错啦，请稍后再试~',
					'tipsModelInfo.showModelStatus': true
				});
			}
		});
	},
	//选择收货地址
	chooseAddress: function(e) {
		wx.navigateTo({
			url: '../address/addressLists/addressLists'
		});
	},
	//协议选框
	checkChange: function(e) {
		this.setData({
			checkValue: !this.data.checkValue
		});
	},
	//隐藏号码售卖状态弹窗
	goBackBtn: function(e) {
		this.setData({
			'tipsModelInfo.showModelStatus': false,
			'zfModelInfo.showModelStatus': false,
		});
	},
	//关闭增值业务弹窗
	closeBtn: function(e) {
		this.setData({
			'tcModelInfo.showModelStatus': false
		});
	},
	//选择增值业务弹窗按钮
	chooseZzbtn: function(e) {
		var index = this.data.zzid;
		var zengzhiDataNew = this.data.zengzhiData;
		if (this.data.tcModelInfo.chooseStatus) {
			zengzhiDataNew[index].isDefault = true;
		} else {
			zengzhiDataNew[index].isDefault = false;
		}
		this.setData({
			zengzhiData: zengzhiDataNew,
			'tcModelInfo.showModelStatus': false
		})
	},
	//打开资费详情弹窗
	openZfxqWindow: function(e) {
		var zifeiIndex = this.data.llid;
		var zifeiTitle = this.data.liuliangData[zifeiIndex].name;
		var zifeiDescribe = this.data.liuliangData[zifeiIndex].fee_describe.replace(/<br\/\>/g, "\n");
		this.setData({
			'zfModelInfo.showModelStatus': true,
			'zfModelInfo.title': zifeiTitle,
			'zfModelInfo.zishuoming': zifeiDescribe,
		})
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
	},
	//打开五一活动弹窗
	openHdRule: function(e) {
		this.setData({
			showRuleModel: true
		})
	},
	//关闭五一活动弹窗
	closeHdRule: function(e) {
		this.setData({
			showRuleModel: false
		})
	}
})
