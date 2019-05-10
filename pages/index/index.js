const app = getApp();
var util = require('../../utils/util.js');
var ajaxUrl = util.ajaxUrl;

Page({
	data: {
		isSubscribe: false,
		navList: [{
				title: '预约购卡',
				imgSrc: '../../images/sim1.png',
				summary: '选号买卡不分先后\n灵活选择'
			},
			{
				title: '本月特卖',
				imgSrc: '../../images/excellent.png',
				summary: '每月28号更新特价号码\n超值套餐随心配'
			},
			{
				title: '卡盟',
				imgSrc: '../../images/bag.png',
				summary: '卖卡赚钱，佣金丰厚\n您的随身营业厅'
			},
			{
				title: '会员中心',
				imgSrc: '../../images/member.png',
				summary: '专属特权，积分兑换\n彰显尊贵'
			}
		],
		status: 0,
		//切换面板flag
		selected: true,
		selected1: false,
		selected2: false,
		selected3: false,
		temaiSelect: true,
		temaiSelect1: false,
		inputVal: '',
		holderText: '',
		showModelInfo: {
			btn: '确定'
		},
		downModelInfo: {
			showModelStatus: false,
			appImgSrc: 'https://www.m10027.com/xiaochengxubanner/kmQRCode.png'
		}
	},
	getStatus(e) {
		var navStatus = e.currentTarget.dataset.index;
		var navListData = this.data.navList;
		if (navStatus == 0) {
			navListData[0].imgSrc = '../../images/sim1.png';
			navListData[1].imgSrc = '../../images/excellent.png';
			navListData[2].imgSrc = '../../images/bag.png';
			navListData[3].imgSrc = '../../images/member.png';
			this.setData({
				selected: true,
				selected1: false,
				selected2: false,
				selected3: false,
			});
		} else if (navStatus == 1) {
			navListData[0].imgSrc = '../../images/sim.png';
			navListData[1].imgSrc = '../../images/excellent1.png';
			navListData[2].imgSrc = '../../images/bag.png';
			navListData[3].imgSrc = '../../images/member.png';
			this.setData({
				selected: false,
				selected1: true,
				selected2: false,
				selected3: false,
			});
		} else if (navStatus == 2) {
			navListData[0].imgSrc = '../../images/sim.png';
			navListData[1].imgSrc = '../../images/excellent.png';
			navListData[2].imgSrc = '../../images/bag1.png';
			navListData[3].imgSrc = '../../images/member.png';
			this.setData({
				selected: false,
				selected1: false,
				selected2: true,
				selected3: false,
			});
		} else if (navStatus == 3) {
			navListData[0].imgSrc = '../../images/sim.png';
			navListData[1].imgSrc = '../../images/excellent.png';
			navListData[2].imgSrc = '../../images/bag.png';
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
		var huodongValid = app.globalData.huodongValid;
		if (huodongValid) {
			wx.navigateTo({
				url: '../../packageA/pages/excellent/excellent?code=yztc'
			})
		} else {
			wx.navigateTo({
				url: '../excellent/excellent?code=yztc'
			})
		};
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
		this.setData({
			'downModelInfo.showModelStatus': true
		})
	},
	//去套餐页
	chooseTaocanLl: function(e) {
		//先判断号码是否可买 如果为0则可买去套餐页
		var telNum = e.currentTarget.dataset.telnum;
		getApp().globalData.ywscOrderType = '1';
		var whereFrom = e.currentTarget.dataset.wherefrom;
		var occupyMoney = e.currentTarget.dataset.occupymoney;
		util.chooseTaocan(telNum, whereFrom, occupyMoney, '', '', '', '', 'tm', 'lhtm');
	},
	//去套餐页
	chooseTaocanQl: function(e) {
		var qlTelNum = e.currentTarget.dataset.qltelnum;
		var qlTelNum1 = e.currentTarget.dataset.qltelnum1;
		var qlNum = qlTelNum + ',' + qlTelNum1;
		getApp().globalData.ywscOrderType = '1';
		var whereFrom = e.currentTarget.dataset.wherefrom;
		var occupyMoney = e.currentTarget.dataset.occupymoney;
		var doubleNumStatus = true;
		util.chooseTaocan('', whereFrom, occupyMoney, doubleNumStatus, qlTelNum, qlTelNum1, '', 'tm', 'qlhtm');
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
		wx.showLoading({
			title: '加载中...',
			mask: true
		});
		var that = this;
		//获取服务状态
		that.getServiceStatus(that);
	},
	onShow: function() {
		//移除高级筛选参数数据
		getApp().globalData.hsQueryData = '';
	},
	//获取首页广告
	getAds: function(that) {
		wx.request({
			url: ajaxUrl + 'cardServiceController.do?bannerIndex&mp=1',
			method: 'POST',
			success: function(res) {
				var bannerArr = res.data;
				var bannerListLength = bannerArr.length;
				for (var i = 0; i < bannerListLength; i++) {
					if (bannerArr[i].classify == 2) {
						that.setData({
							showBanner: true,
							seconds: 3,
							bannerSrc: bannerArr[i].activityImage1
						});
						var setTime;
						var seconds = that.data.seconds;
						setTime = setInterval(function() {
							if (seconds <= 0) {
								clearInterval(setTime);
								that.setData({
									showBanner: false
								})
							}
							seconds--;
							that.setData({
								seconds: seconds
							});
						}, 1000);
					}
				};
				//首页banner
				that.getBanners(that);
			},
			fail: function(err) {
				wx.showToast({
					title: '广告加载失败',
					icon: 'none',
					duration: 2000
				});
			}
		});
	},
	//获取banner
	getBanners: function(that) {
		wx.request({
			url: 'https://www.m10027.com/WeChatServices/xiaochengxu.ashx?',
			data: {
				requestType: 'GetBannerList',
				source: '号卡商城小程序'
			},
			dataType: JSON,
			success: function(resData) {
				var resJson = JSON.parse(resData.data); //Json 转 字符串
				if (resJson.Status) {
					that.setData({
						banners: resJson.ls
					});
					//首页特卖靓号展示
					that.getTmIndexInfo(that);
				}
			},
			fail: function(res) {
				console.log(res)
				wx.showModal({
					title: '提示',
					content: res.errMsg,
					showCancel: false,
					success: function(res) {}
				})
			}
		})
	},
	/**banner点击事件 */
	gotolink: function(e) {
		var linkpath = e.currentTarget.dataset.link;
		var linktype = e.currentTarget.dataset.linktype;
		if (linktype === '0') {
			wx.navigateToMiniProgram({
				appId: linkpath,
				path: '',
				success(res) {
					console.log('banner超链接跳转小程序成功')
				}
			})
		} else if (linktype === '1') {
			if (linkpath) {
				wx.navigateTo({
					url: linkpath,
					success(res) {
						console.log('banner超链接跳转链接路径成功')
					}
				})
			} else {
				console.log("无链接路径");
			}
		} else if (linktype === '2') {
			wx.setStorageSync('linkurl', linkpath)
			wx.navigateTo({
				url: 'weblink/weblink?linkPath=' + linkpath,
				success(res) {
					console.log('banner超链接跳转链接URL成功')
				}
			})
		}
	},
	//获取首页本月特卖号码资源
	getTmIndexInfo: function(that){
		var liangNum = [];
		var qinglvNum = [];
		wx.request({
			url: ajaxUrl + 'cardServiceController.do?tMIndexList',
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function(res) {
				if (res.statusCode == 200) {
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
					};
				} else {
					that.setData({
						tmListsNoData: true
					});
				};
				//会员中心产品展示
				that.getProductList(that);
			},
			fail: function(err) {
				console.log(err);
			}
		});
	},
	//获取首页会员中心产品列表
	getProductList: function(that){
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
							productListsArr[i].holderText = '酷我音乐';
						} else if (productListsArr[i].productType == 2) {
							productListsArr[i].imgSrc = '../../images/souhu.png';
							productListsArr[i].holderText = '搜狐视频';
						} else {
							productListsArr[i].imgSrc = '../../images/mobike.png';
							productListsArr[i].holderText = '摩拜单车';
						};
						var itemProductName = productListsArr[i].productName.split(' ')[0];
						productListsArr[i].itemProductName = itemProductName;
					};
					that.setData({
						productLists: productListsArr
					})
				};
				wx.hideLoading();
			},
			fail: err => {
				console.log(err);
			}
		});
	},
	//显示底部抽屉
	showModal: function(e) {
		//购买支付接口有问题 暂时提示用户去公众号购买会员 beign
		this.setData({
			'showModelInfo.showModelStatus': true,
			'showModelInfo.title': '功能维护中，请到"远微商城"公众号进行购买。'
		});
		return false;
		//购买支付接口有问题 暂时提示用户去公众号购买会员 end

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
			productName: e.currentTarget.dataset.productname,
			holderText: e.currentTarget.dataset.holdertext
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
				if (!that.data.isSubscribe) {
					var openId = app.globalData.openId;
					console.log(openId);
				}
				var itemId = that.data.itemId,
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
			'downModelInfo.showModelStatus': false
		})
	},
	//保存图片到手机
	saveImg: function() {
		var that = this,
			imgSrc = this.data.downModelInfo.appImgSrc;
		util.saveImgToPhotosAlbumTap(that, imgSrc);
	},
	/**获取服务状态 */
	getServiceStatus: function(that) {
		wx.request({
			url: 'https://www.m10027.com/WeChatServices/ServicesForCommon.ashx?',
			data: {
				requestType: 'GetServiceStatus',
				serviceName: '号卡商城小程序'
			},
			dataType: JSON,
			success: function(resData) {
				// wx.hideLoading();
				var resJson = JSON.parse(resData.data); //Json 转 字符串
				if (resJson.Status) {
					wx.setStorageSync('ServiceStatus', resJson.Value);
					//维护状态 值为1
					if (resJson.Value === '1') {
						wx.setStorageSync('weihumsg', resJson.Msg);
						wx.redirectTo({
							url: '../weihu/weihu',
						})
					} else {
						//判断是否获取到用户信息
						if (app.globalData.getUserInfoFail) {
							var getUserOpenidSuccess = false;
							that.setData({
								'userModelInfo.showModelStatus': true,
								'userModelInfo.title': '获取用户信息失败，请稍后再试。'
							});
						} else {
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 所以此处加入 callback 以防止这种情况
							app.getUserInfoFailCallback = getUserInfoFail => {
								if (getUserInfoFail) {
									var getUserOpenidSuccess = false;
									that.setData({
										'userModelInfo.showModelStatus': true,
										'userModelInfo.title': '获取用户信息失败，请稍后再试。'
									});
								}
							}
						};
						if(!getUserOpenidSuccess){
							//获取首页广告
							that.getAds(that);
						};
					}
				} else {
					// wx.hideLoading();
					wx.showModal({
						title: '提示',
						content: '抱歉，获取服务状态异常，请退出重试',
						showCancel: false,
						success: function(res) {}
					})
				}
			},
			fail: function(resData) {
				wx.hideLoading();
				wx.showModal({
					title: '提示',
					content: resData.errMsg,
					showCancel: false,
					success: function(res) {}
				})
			}
		})
	},
	//跳过广告banner
	skipBanner: function(e) {
		this.setData({
			showBanner: false
		})
	},
	//转发
	onShareAppMessage: function() {
		return {
			title: '海量号码资源，限时特卖',
			path: 'pages/index/index',
			imageUrl: '../../images/czfx.jpg',
			success: function() {
				wx.showShareMenu({
					withShareTicket: true
				})
			}
		}
	}
});
