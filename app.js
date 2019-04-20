//app.js
App({
	globalData: {
		userInfo: null,
		idSwitch: 0,
		showModalStatus: false,
		openId: ''
	},
	/**
	 * 当小程序从前台进入后台，会触发 onHide
	 */
	onHide: function() {
		wx.clearStorage();
	},
	onLaunch: function() {
		var that = this;
		var openId = that.globalData.openId;
		if (openId != '') {
			//已获取用户openid
			//console.log("jw已获取用户openid");
		} else {
			wx.login({
				success: function(res) {
					if (res.code) {
						wx.request({
							url: 'https://www.m10027.com/WeChatServices/xiaochengxu.ashx?',
							data: {
								requestType: 'LoginCodeVerify',
								source: 'sc',
								code: res.code
							},
							method: 'GET',
							success: function(openIdRes) {
								that.globalData.payOpenId = openIdRes.data.info.openid
								if (openIdRes.data.info.unionid == null || openIdRes.data.info.unionid == "" || openIdRes.data.info.unionid == undefined) {
									//wx.showToast({
									// 	title: '获取用户信息失败，请稍后再试。',
									// 	icon: 'none',
									// 	duration: 2000
									//});
									
									//提示用户去关注远微商城公众号
									that.globalData.isSubscribe = true;
								} else {
									wx.request({
										url: 'https://www.m10027.com/WeChatServices/xiaochengxu.ashx?',
										data: {
											requestType: 'GetOpenIdForUnionId',
											unionId: openIdRes.data.info.unionid,
											mp: 1
										},
										header: {
											'content-type': 'application/x-www-form-urlencoded' // 默认值
										},
										success: function(res) {
											if (res.data.Status == true && res.data.Value != "") {
												that.globalData.openId = res.data.Value;
											} else {
												//提示用户去关注远微商城公众号
												that.globalData.isSubscribe = true;
											}
										},
										fail: function(err) {
											console.log(err);
										}
									});
								};
							},
							fail: function(error) {
								//wx.showToast({
								// 	title: '获取用户信息失败，请稍后再试。',
								// 	icon: 'none',
								// 	duration: 2000
								//});

								//提示用户去关注远微商城公众号
								that.globalData.isSubscribe = true;
							}
						})
					} else {
						//wx.showToast({
						// 	title: '登录失败！' + res.errMsg,
						// 	icon: 'none',
						// 	duration: 2000
						//});

						//提示用户去关注远微商城公众号
						that.globalData.isSubscribe = true;
					}
				}
			})
		}
		//身份证是否上传总开关
		wx.request({
			url: 'https://www.m10027.com/jeewx/eCardServiceController.do?upadateKg',
			data: {
				id: '1234'
			},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function(res) {
				if (res.statusCode == 500 || res.statusCode == 404) {
					wx.showModal({
						title: '提示',
						content: '系统维护中',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})
				};
				//kg号码直选优质套餐本月特卖 eKgs iKgs 上传身份证开关----0，关闭，1开启
				that.globalData.upadateKg = res.data[0].kg;
				that.globalData.upadateEkgs = res.data[0].ekgs;
				that.globalData.upadateIkgs = res.data[0].ikgs;
				//打开相册选项开关 xckg号码直选优质套餐本月特卖 iKg eKg ----1为开启 只能拍照 0为关闭 可拍可选
				that.globalData.xckg = res.data[0].xckg;
				that.globalData.iKg = res.data[0].iKg;
				that.globalData.eKg = res.data[0].eKg;

			},
			fail: function(err) {
				console.log(err);
				wx.showModal({
					title: '提示',
					content: '系统维护中',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			}
		});
		//获取用户当前位置（市）
		wx.getLocation({
			type: 'wgs84',
			success: function(res) {
				var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
				wx.request({
					url: 'https://www.m10027.com/WeChatServices/ServicesForCommon.ashx?requestType=Geocoder',
					data: {
						lat: latitude,
						lng: longitude
					},
					header: {
						'content-type': 'application/json'
					},
					success: function(res) {
						var location = res.data.info.city.replace('市', '');
						that.globalData.city = location;
					},
					fail: err => {
						that.globalData.city = '全国';
					}
				});
			},
			fail: err => {
				that.globalData.city = '全国';
			}
		});
	}
})
