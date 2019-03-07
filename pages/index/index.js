//index.js
const app = getApp();
var util = require('../../utils/util.js');
var ajaxUrl = util.ajaxUrl;

Page({
	data: {
		isSubscribe: false,
		//首页轮播
		focusImgUrls: [{
				linkUrl: '#',
				imgUrl: '../../images/01.jpg'
			},
			{
				linkUrl: '#',
				imgUrl: '../../images/02.jpg'
			},
			{
				linkUrl: '#',
				imgUrl: '../../images/03.jpg'
			}
		],
		navList: [{
				title: '购卡',
				imgSrc: '../../images/sim1.png',
				summary: '选号买卡不分先后\n灵活选择'
			},
			{
				title: '本月特卖',
				imgSrc: '../../images/bag.png',
				summary: '每月28号更新特价号码\n超值套餐随心配'
			},
			{
				title: '卡盟',
				imgSrc: '../../images/excellent.png',
				summary: '卖卡赚钱，佣金丰厚\n您的随身营业厅'
			},
			{
				title: '会员中心',
				imgSrc: '../../images/member.png',
				summary: '专属特权，积分兑换\n彰显尊贵'
			}
		],
		status: 0,
		indicatorDots: true, //是否显示面板指示点
		autoplay: true, //是否自动切换
		interval: 3000, //自动切换时间间隔
		duration: 500, //滑动动画时长
		//切换面板flag
		selected: true,
		selected1: false,
		selected2: false,
		selected3: false,
		temaiSelect: true,
		temaiSelect1: false,
		inputVal: '',
		vipholder: '请输入您登陆或绑定酷我音乐的手机号',
		showModelInfo: {
			btn: '确定'
		}
	},
	getStatus(e) {
		var navStatus = e.currentTarget.dataset.index;
		var navListData = this.data.navList;
		if (navStatus == 0) {
			navListData[0].imgSrc = '../../images/sim1.png';
			navListData[1].imgSrc = '../../images/bag.png';
			navListData[2].imgSrc = '../../images/excellent.png';
			navListData[3].imgSrc = '../../images/member.png';
			this.setData({
				selected: true,
				selected1: false,
				selected2: false,
				selected3: false,
			});
		} else if (navStatus == 1) {
			navListData[0].imgSrc = '../../images/sim.png';
			navListData[1].imgSrc = '../../images/bag1.png';
			navListData[2].imgSrc = '../../images/excellent.png';
			navListData[3].imgSrc = '../../images/member.png';
			this.setData({
				selected: false,
				selected1: true,
				selected2: false,
				selected3: false,
			});
		} else if (navStatus == 2) {
			navListData[0].imgSrc = '../../images/sim.png';
			navListData[1].imgSrc = '../../images/bag.png';
			navListData[2].imgSrc = '../../images/excellent1.png';
			navListData[3].imgSrc = '../../images/member.png';
			this.setData({
				selected: false,
				selected1: false,
				selected2: true,
				selected3: false,
			});
		} else if (navStatus == 3) {
			navListData[0].imgSrc = '../../images/sim.png';
			navListData[1].imgSrc = '../../images/bag.png';
			navListData[2].imgSrc = '../../images/excellent.png';
			navListData[3].imgSrc = '../../images/member1.png';
			this.setData({
				selected: false,
				selected1: false,
				selected2: false,
				selected3: true,
			});
		};
		this.setData({
			status: navStatus,
			navList: navListData
		});
	},
	//选择靓号特卖
	temaiSelect: function(e) {
		this.setData({
			temaiSelect: true,
			temaiSelect1: false
		})
	},
	//选择情侣号特卖
	temaiSelect1: function(e) {
		this.setData({
			temaiSelect: false,
			temaiSelect1: true
		})
	},
	/*
	 ** 页面跳转区域
	 */
	//远特i卡跳转页面
	goToYjgk: function() {
		wx.navigateTo({
			url: '../iCard/iCard'
		})
	},
	//心仪数字跳转页面
	goToXysz: function() {
		wx.navigateTo({
			url: '../hopeNum/hopeNum'
		})
	},
	//号码直选跳转页面
	goToHmzx: function() {
		wx.navigateTo({
			url: '../chooseNum/chooseNum'
		})
		// 		this.setData({
		// 			'showModelInfo.showModelStatus': true,
		// 			'showModelInfo.title': '正在维护中'
		// 		});
	},
	//优质套餐跳转页面
	goToYztc: function() {
		// 		this.setData({
		// 			'showModelInfo.showModelStatus': true,
		// 			'showModelInfo.title': '正在维护中'
		// 		});
		wx.navigateTo({
			url: '../excellent/excellent?code=yztc'
		})
	},
	//靓号特卖跳转页面
	goToLhtm: function() {
		wx.navigateTo({
			url: '../lhtm/lhtm'
		})
	},
	//情侣号特卖跳转页面
	goToQlhtm: function() {
		wx.navigateTo({
			url: '../qlhtm/qlhtm'
		})
	},
	//卡盟 抢先体验
	kmBuy: function() {
		wx.navigateTo({
			url: '../kmBuy/kmBuy'
		})
	},
	//去套餐页
	chooseTaocanLl: function(e) {
		wx.setStorage({
			key: 'ywscOrderType',
			data: '1'
		});
		var telNum = e.currentTarget.dataset.telnum;
		var whereFrom = e.currentTarget.dataset.wherefrom;
		var occupyMoney = e.currentTarget.dataset.occupymoney;
		util.chooseTaocan(telNum, whereFrom, occupyMoney, '', '', '', '', 'tm', 'lhtm');
	},
	//去套餐页
	chooseTaocanQl: function(e) {
		wx.setStorage({
			key: 'ywscOrderType',
			data: '1'
		});
		var qlTelNum = e.currentTarget.dataset.qltelnum;
		var qlTelNum1 = e.currentTarget.dataset.qltelnum1;
		var whereFrom = e.currentTarget.dataset.wherefrom;
		var occupyMoney = e.currentTarget.dataset.occupymoney;
		var doubleNumStatus = true;
		util.chooseTaocan('', whereFrom, occupyMoney, doubleNumStatus, qlTelNum, qlTelNum1, '', 'tm', '');
	},
	//获取滚动条当前位置 
	onPageScroll: function(e) {
		if (e.scrollTop > 300) {
			this.setData({
				floorstatus: true
			});
		} else {
			this.setData({
				floorstatus: false
			});
		}
	},
	//回到顶部 
	goTop: function(e) {
		// 一键回到顶部 
		if (wx.pageScrollTo) {
			wx.pageScrollTo({
				scrollTop: 0
			})
		} else {
			wx.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
	},
	/*
	 ** 数据展示
	 */
	onLoad: function() {
		var that = this;
		if (wx.getStorageSync('isSubscribe')) {
			that.setData({
				isSubscribe: true
			});
		};
		wx.showLoading({
			title: '加载中...',
			mask: true
		});
		//首页banner
		wx.request({
			url: ajaxUrl + 'cardServiceController.do?bannerIndex&mp=1',
			method: 'POST',
			success: function(res) {
				if (res) {
					that.setData({
						focusImgUrls: res.data
					});
				} else {
					that.setData({
						'showModelInfo.showModelStatus': true,
						'showModelInfo.title': '正在维护中'
					});
				};
			},
			fail: function(err) {
				wx.showToast({
					title: '加载超时，请重新加载',
					icon: 'none',
					duration: 2000
				});
			}
		});
		//本月特卖首页号码展示
		var that = this;
		var liangNum = [];
		var qinglvNum = [];
		wx.request({
			url: ajaxUrl + 'cardServiceController.do?tMIndexList',
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function(res) {
				if (res.data.length) {
					var numData = res.data;
					numData.forEach(function(item, index) {
						if (item.numberType == 0) {
							qinglvNum.push(item);
						} else if (item.numberType == 2) {
							liangNum.push(item);
						}
					});
					that.setData({
						qinglvNumLists: qinglvNum,
						liangNumLists: liangNum
					});
				} else {
					that.setData({
						tmListsNoData: true
					});
				}
			},
			fail: function(err) {
				console.log(err);
			},
			complete: function(res){
				wx.hideLoading();
			}
		});
		//会员中心
		wx.request({
			url: 'https://www.m10027.com/BusinessServices/ServicesForBusiness.ashx?requestType=GetProductList',
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				if (res.data.Status == true) {
					var productListsArr = res.data.list;
					for (var i = 0; i < productListsArr.length; i++) {
						if (productListsArr[i].productType == 1) {
							productListsArr[i].imgSrc = '../../images/kuwo.png';
						} else if (productListsArr[i].productType == 2) {
							productListsArr[i].imgSrc = '../../images/souhu.png';
						} else {
							productListsArr[i].imgSrc = '../../images/mobike.png';
						};
						var itemProductName = productListsArr[i].productName.split(' ')[0];
						productListsArr[i].itemProductName = itemProductName;
					};
					that.setData({
						productLists: productListsArr
					})
				};
			},
			fail: err => {
				console.log(err);
			}
		});
	},
	onShow: function() {
		//移除高级筛选参数数据
		wx.removeStorageSync('hsQueryData');
	},
	//显示底部抽屉
	showModal: function(e) {
		// 显示遮罩层
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "linear",
			delay: 0
		});
		this.animation = animation;
		animation.translateY(700).step();
		this.setData({
			animationData: animation.export(),
			showModalStatus: true
		});
		setTimeout(function() {
			animation.translateY(0).step();
			this.setData({
				animationData: animation.export()
			});
		}.bind(this), 200);
		this.setData({
			itemId: e.currentTarget.dataset.itemid,
			productType: e.currentTarget.dataset.producttype,
			productName: e.currentTarget.dataset.productname
		});
	},
	//隐藏底部抽屉
	hideModal: function() {
		// 隐藏遮罩层
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation;
		animation.translateY(700).step();
		this.setData({
			animationData: animation.export()
		})
		setTimeout(function() {
			animation.translateY(0).step();
			this.setData({
				animationData: animation.export(),
				showModalStatus: false
			});
		}.bind(this), 200);
	},
	//防止抽屉点透
	move: function() {},
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
	//vip购买
	buyVip: function(e) {
		var that = this;
		var zhanghao = that.data.inputVal;
		if (zhanghao.length == 0) {
			wx.showToast({
				title: '请输入您要购买的账号。',
				icon: 'none',
				duration: 2000
			});
		} else {
			if (!(/^1[34578]\d{9}$/.test(zhanghao))) {
				wx.showToast({
					title: '请输入正确的手机号码。',
					icon: 'none',
					duration: 2000
				});
			} else {
				wx.showLoading({
					mask: true,
					title: '加载中'
				});
				var openId = wx.getStorageSync('openId'),
					itemId = that.data.itemId,
					productType = that.data.productType,
					productName = that.data.productName;
				wx.request({
					url: 'https://www.m10027.com/BusinessServices/ServicesForBusiness.ashx?requestType=VideoBuyOrder',
					method: 'POST',
					data: {
						openId: openId,
						phoneNum: zhanghao,
						itemId: itemId,
						productType: productType,
						productName: productName,
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					success: res => {
						wx.hideLoading();
						if (res.data.Status == true) {
							that.hideModal();
							wx.requestPayment({
								timeStamp: res.data.info.timeStamp,
								nonceStr: res.data.info.nonceStr,
								package: res.data.info.packageStr,
								signType: res.data.info.signType,
								paySign: res.data.info.paySign,
								success(res) {
									that.setData({
										'showModelInfo.showModelStatus': true,
										'showModelInfo.title': '支付成功'
									});
								},
								fail(res) {
									if (res.errMsg == 'requestPayment:fail cancel') {
										that.setData({
											'showModelInfo.showModelStatus': true,
											'showModelInfo.title': '取消支付'
										});
									} else if (res.errMsg == 'requestPayment:fail') {
										that.setData({
											'showModelInfo.showModelStatus': true,
											'showModelInfo.title': '支付失败'
										});
									} else {
										that.setData({
											'showModelInfo.showModelStatus': true,
											'showModelInfo.title': '支付异常'
										});
									};
								}
							})
						} else {
							that.setData({
								'showModelInfo.showModelStatus': true,
								'showModelInfo.title': '购买失败，请稍后再试'
							});
						}
					},
					fail: err => {
						that.setData({
							'showModelInfo.showModelStatus': true,
							'showModelInfo.title': '购买失败，请稍后再试'
						});
					}
				});
			};
		};
	},
	//关闭提示框
	goBackBtn: function(e) {
		this.setData({
			'showModelInfo.showModelStatus': false,
		})
	}
});
