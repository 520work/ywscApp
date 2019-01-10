//app.js
App({
	globalData: {
		userInfo: null,
		idSwitch: 0,
		showModalStatus: false,
		addressData: [{
			name: '收货人',
			tel: '17011112222',
			address: '北京市朝阳区恒通商务园B23A座二楼'
		}, {
			name: '收货人2',
			tel: '18011112222',
			address: '北京市xxxxxxxxxxxxxxx',
			defaultAddress: true
		}]
	},
	/**
	 * 当小程序从前台进入后台，会触发 onHide
	 */
	onHide: function() {
		wx.clearStorage();
	},
	onLaunch: function() {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);

		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
			}
		});
		// 获取用户信息
		// 		wx.getSetting({
		// 			success: res => {
		// 				if (res.authSetting['scope.userInfo']) {
		// 					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
		// 					wx.getUserInfo({
		// 						success: res => {
		// 							// 可以将 res 发送给后台解码出 unionId
		// 							this.globalData.userInfo = res.userInfo
		// 
		// 							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
		// 							// 所以此处加入 callback 以防止这种情况
		// 							if (this.userInfoReadyCallback) {
		// 								this.userInfoReadyCallback(res)
		// 							}
		// 						}
		// 					})
		// 				}
		// 			}
		// 		});
		var openId = wx.getStorageSync('openId');
		if (openId) {
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
								wx.setStorage({
									key: 'payOpenId',
									data: openIdRes.data.info.openid
								});
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
										if (res.data.Status == true) {
											wx.setStorage({
												key: "openId",
												data: res.data.Value
											});
										} else {
											wx.showToast({
												title: '请先关注远微商城公众号',
												icon: 'none',
												duration: 2000
											});
										}
									},
									fail: function(err) {
										console.log(err);
									}
								});

								// 								// 判断openId是否获取成功
								// 								if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
								// 									// 询问用户 是否授权
								// 									wx.getUserInfo({
								// 										success: function(data) {
								// 											wx.setStorage({
								// 												key: "openId",
								// 												data: openIdRes.data.openid
								// 											});
								// 										},
								// 										fail: function(failData) {
								// 											console.info("用户拒绝授权");
								// 										}
								// 									});
								// 								} else {
								// 									console.log("获取用户openId失败");
								// 								}
							},
							fail: function(error) {
								wx.showToast({
									title: '获取用户信息失败，请稍后再试。',
									icon: 'none',
									duration: 2000
								});
							}
						})
					} else {
						wx.showToast({
							title: '登录失败！' + res.errMsg,
							icon: 'none',
							duration: 2000
						});
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
				//kg----0，关闭，1开启
				wx.setStorage({
					key: "upadateKg",
					data: res.data[0].kg
				});
			},
			fail: function(err) {
				console.log(err);
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
						wx.setStorage({
							key: "city",
							data: location
						});
					},
					fail: err => {
						wx.showToast({
							title: '获取用户位置失败',
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			fail: err => {
				wx.showToast({
					title: '获取用户位置失败',
					icon: 'none',
					duration: 2000
				});
			}
		});

	}
})
