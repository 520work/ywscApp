var app = getApp();
var util = require('../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({
	data: {
		idFaceImgPath: '../../images/idface.png',
		idBackImgPath: '../../images/idback.png',
		headImgPath: '../../images/head.png',
		showModelInfo: {
			title: '非常抱歉',
			content: '经查询，您当前的身份信息已经绑定了5个信时空号码。请更换身份信息后再试。',
			btn: '返回',
			showModelStatus: false
		},
		idName: "",
		idCard: "",
		tipsModelInfo: {
			btn: '确定'
		},
		idFaceSuccess: true,
		idBackSuccess: true,
		headSuccess: true
	},
	//打开相机或者选择照片
	chooseImg: function(e) {
		var imgType = e.currentTarget.dataset.id;
		var that = this;
		wx.chooseImage({
			count: 1, // 默认9  
			sizeType: 'compressed', // 可以指定是原图还是压缩图，默认二者都有 ['original', 'compressed'] 
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
			success: function(res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
				var tempFilePaths = res.tempFilePaths;
				//判断上传照片类型
				if (imgType == 'uploadIdFace') {
					that.setData({
						idFlag: true,
						idFaceFlag: true,
					});
				} else if (imgType == 'uploadIdBack') {
					that.setData({
						idFlag: true,
						idFaceFlag: false,
					});
				} else {
					that.setData({
						idFlag: false,
						idFaceFlag: false,
					});
				};
				//上传提示信息
				wx.showLoading({
					mask: true,
					title: '正在上传...'
				});
				//将图片路径转换为base64编码格式
				wx.getFileSystemManager().readFile({
					filePath: res.tempFilePaths[0], //选择图片返回的相对路径 
					encoding: 'base64', //编码格式 
					success: res => {
						//图片编码成功 调用上传照片接口
						wx.request({
							url: ajaxUrl + 'eCardServiceController.do?addPhoto',
							method: 'POST',
							data: {
								image: res.data
							},
							header: {
								"Content-Type": "application/x-www-form-urlencoded"
							},
							success: res => {
								console.log(res);
								//成功上传照片
								if (!res.data[0].imagePath == "") {
									//保存参数变量信息
									var imgPath = res.data[0].imagePath;
									var uuidData = new Date().getTime();
									//当上传照片为身份证正面照时 发起获取身份证信息接口
									var idFlag = that.data.idFlag;
									var idFaceFlag = that.data.idFaceFlag;
									//如果当前照片为身份证照片
									if (idFlag) {
										//读取信息提示
										wx.showLoading({
											mask: true,
											title: '读取身份信息中'
										});
										wx.request({
											url: 'https://www.m10027.com/faceidServices/ServicesForFaceID.ashx?',
											data: {
												requestType: "IDCardOCR",
												source: "3",
												imgPath: imgPath,
												uuid: "e" + uuidData,
											},
											success: res => {
												wx.hideLoading();
												//如果是身份证正面照
												if (idFaceFlag) {
													//上传失败
													if (res.data.Status == false) {
														wx.showToast({
															title: res.data.Msg,
															icon: 'none',
															duration: 2000
														});
														that.setData({
															idFaceSuccess: false,
															idName: '',
															idCard: ''
														});
													} else { //身份证信息未正确识别
														if (res.data.OCRIDCARDResponse.name == null) {
															wx.showToast({
																title: '身份信息有误,请重新上传',
																icon: 'none',
																duration: 2000
															});
															that.setData({
																idFaceSuccess: false,
																idName: '',
																idCard: ''
															});
														} else { //识别成功
															that.setData({
																"photoModelInfo.title": '请确定身份信息',
																"photoModelInfo.content": '姓名：' + res.data.OCRIDCARDResponse.name + "\n身份证号码：" + res.data
																	.OCRIDCARDResponse.id_card_number,
																"photoModelInfo.cancelBtn": '有误,重新上传',
																"photoModelInfo.confirmBtn": '正确',
																"photoModelInfo.showModelStatus": true,
																idName: res.data.OCRIDCARDResponse.name,
																idCard: res.data.OCRIDCARDResponse.id_card_number,
																idFaceImgPath: imgPath
															});
														};
													}
												} else { //如果是身份证背面照
													if (res.data.Status == false) {
														wx.showToast({
															title: res.data.Msg,
															icon: 'none',
															duration: 2000
														});
														that.setData({
															idBackSuccess: false
														});
													} else {
														if (res.data.OCRIDCARDResponse.valid_date == "") {
															wx.showToast({
																title: '身份信息有误,请重新上传',
																icon: 'none',
																duration: 2000
															});
															that.setData({
																idBackSuccess: false
															});
														} else {
															wx.showToast({
																title: '上传成功',
																icon: 'success',
																duration: 2000
															});
															that.setData({
																idBackImgPath: imgPath,
																idBackSuccess: true
															});
														};
													}
												}
											},
											fail: function(err) {
												wx.hideLoading();
												wx.showToast({
													title: '身份信息读取失败,请重新上传.',
													icon: 'none',
													duration: 2000
												});
												that.setData({
													idFaceSuccess: false,
													idBackSuccess: false
												});
												console.log(err);
											}
										});
									} else { //如果上传的是免冠照片
										//读取信息提示
										wx.showLoading({
											mask: true,
											title: '对比身份信息中'
										});
										//先判断用户是否上传有效身份证正面照片
										var idFaceSuccess = that.data.idFaceSuccess;
										if (!idFaceSuccess) {
											wx.showToast({
												title: '请先上传有效身份证正面照片',
												icon: 'none',
												duration: 2000
											});
										} else {
											//当用户上传了有效的身份证正面照后 调用身份信息对比接口
											var faceImage = that.data.idFaceImgPath;
											wx.request({
												url: ajaxUrl + 'eCardServiceController.do?identityDb',
												method: 'POST',
												data: {
													faceImage: faceImage,
													handImage: imgPath
												},
												header: {
													"Content-Type": "application/x-www-form-urlencoded"
												},
												success: res => {
													console.log(res);
													wx.hideLoading();
													if (res.data[0].Status == "1") {
														wx.showToast({
															title: '验证通过',
															icon: 'success',
															duration: 2000
														});
														that.setData({
															headImgPath: imgPath,
															headSuccess: true
														});
													} else {
														wx.showToast({
															title: '验证不通过,请重新上传。',
															icon: 'none',
															duration: 2000
														});
														that.setData({
															headSuccess: false
														});
													}
												},
												fail: err => {
													wx.hideLoading();
													wx.showToast({
														title: '身份信息读取失败,请重新上传。',
														icon: 'none',
														duration: 2000
													});
													that.setData({
														headSuccess: false
													});
												}
											});
										};
									}
								} else {
									wx.hideLoading();
									wx.showToast({
										title: '上传失败,请重新上传。',
										icon: 'none',
										duration: 2000
									});
									that.setData({
										idFaceSuccess: false,
										idBackSuccess: false,
										headSuccess: false
									});
								};
							},
							fail: err => {
								wx.hideLoading();
								wx.showToast({
									title: '上传失败,请重新上传。',
									icon: 'none',
									duration: 2000
								});
								that.setData({
									idFaceSuccess: false,
									idBackSuccess: false,
									headSuccess: false
								});
							}
						});
					}
				})
			}
		});
	},
	//去支付
	goToPay: function(e) {
		var that = this;
		if (that.data.idFaceSuccess == true && that.data.idBackSuccess == true && that.data.headSuccess == true) {
			var idCardBuyNum = app.globalData.idcardbuynum;
			var identityCode = that.data.idCard;
			wx.showLoading({
				mask: true,
				title: '身份信息校验中'
			});
			//调一证五卡接口
			wx.request({
				url: 'https://www.m10027.com/ecard/manageController/getOpenCardCount',
				method: 'POST',
				data: {
					idcard: identityCode,
					num: idCardBuyNum
				},
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: res => {
					console.log(res);
					if (res.data.code == 200) {
						if (res.data.result == 'false') {
							wx.hideLoading();
							that.setData({
								idFaceImgPath: '../../images/idface.png',
								idBackImgPath: '../../images/idback.png',
								headImgPath: '../../images/head.png',
								idName: "",
								idCard: "",
								idModelInfo: {
									title: '非常抱歉',
									content: '亲，已检测到您的身份信息已购买或激活' + res.data.count + '张信时空号卡，最多只可购买或激活5张,请更换身份信息或减少购买数量哦~。',
									btn: '返回',
									showModelStatus: true
								},
								idFaceSuccess: false,
								idBackSuccess: false,
								headSuccess: false
							})
						} else {
							wx.hideLoading();
							wx.showLoading({
								mask: true,
								title: '正在提交订单信息'
							});
							var ywscOrderType = app.globalData.ywscOrderType;
							if (ywscOrderType == 1) {
								//号卡直选
								var orderQueryData = app.globalData.orderQueryData;
								orderQueryData.identityName = that.data.idName;
								orderQueryData.identityCard = identityCode;
								orderQueryData.faceImage = that.data.idFaceImgPath;
								orderQueryData.backImage = that.data.idBackImgPath;
								orderQueryData.handImage = that.data.headImgPath;
								console.log(orderQueryData);
								wx.request({
									url: ajaxUrl + 'xborderCardServiceController.do?xborderCard',
									method: 'POST',
									data: orderQueryData,
									header: {
										"Content-Type": "application/x-www-form-urlencoded"
									},
									success: res => {
										getApp().globalData.orderId = res.data[0].id;
										if (res.data[0].discountMoney == '0') {
											getApp().globalData.yufu = false;
											//调用付款接口
											var payOpenId = app.globalData.payOpenId,
												paidMoney = res.data[0].paidMoney,
												orderNo = res.data[0].outTradeNo;
											util.wxPay(payOpenId, paidMoney, orderNo, that, '小程序号卡商城');
										} else {
											//支付金额大于3000 付定金
											getApp().globalData.yufu = true;
											wx.navigateTo({
												url: '../pay/payAbovePause/pap?payOpenId=' + app.globalData.payOpenId + '&orderNo=' + res.data[
														0]
													.outTradeNo + '&phoneNumber=' + res.data[0].phoneNumber + '&phoneNumber1=' + res.data[0].phoneNumber1 +
													'&city=' + res.data[0].city + '&occupyMoney=' + res.data[0].occupyMoney + '&preDeposit=' + res.data[
														0]
													.preDeposit + '&yhMoney=' + res.data[0].yhMoney + '&discountMoney=' + res.data[0].discountMoney +
													'&paidMoney=' + res.data[0].paidMoney
											})
										};
									},
									fail: err => {
										console.log(err);
										that.setData({
											'tipsModelInfo.showModelStatus': true,
											'tipsModelInfo.title': '出错啦，请稍后再试~'
										});
									}
								});
							} else if (ywscOrderType == 2) {
								//视频会员
							} else if (ywscOrderType == 3) {
								//i卡
								var iCardData = app.globalData.iCardData;
								iCardData.identityName = that.data.idName;
								iCardData.identityCard = identityCode;
								iCardData.faceImage = that.data.idFaceImgPath;
								iCardData.backImage = that.data.idBackImgPath;
								iCardData.handImage = that.data.headImgPath;
								console.log(iCardData);
								//接收I卡订单信息接口
								wx.request({
									url: ajaxUrl + 'iCardServiceController.do?iCard',
									method: 'POST',
									data: iCardData,
									header: {
										"Content-Type": "application/x-www-form-urlencoded"
									},
									success: res => {
										console.log('接收E卡订单信息成功');
										console.log(res);
										wx.hideLoading();
										//成功后 发起付款请求
										getApp().globalData.orderId = res.data[0].id;
										var payOpenId = app.globalData.payOpenId;
										var paidMoney = res.data[0].paidMoney;
										var orderNo = res.data[0].outTradeNo;
										util.wxPay(payOpenId, paidMoney, orderNo, that, '小程序远特i卡');
									},
									fail: err => {
										console.log(err);
										that.setData({
											'tipsModelInfo.showModelStatus': true,
											'tipsModelInfo.title': '出错啦，请稍后再试~'
										});
									}
								});
							} else if (ywscOrderType == 4) {
								//心仪数字 e卡
								var eCardData = app.globalData.eCardData;
								eCardData.identityName = this.data.idName;
								eCardData.identityCard = identityCode;
								eCardData.faceImage = this.data.idFaceImgPath;
								eCardData.backImage = this.data.idBackImgPath;
								eCardData.handImage = this.data.headImgPath;
								console.log(eCardData);
								//接收E卡订单信息接口
								wx.request({
									url: ajaxUrl + 'eCardServiceController.do?eCard',
									method: 'POST',
									data: eCardData,
									header: {
										"Content-Type": "application/x-www-form-urlencoded"
									},
									success: res => {
										console.log('接收E卡订单信息成功');
										console.log(res);
										wx.hideLoading();
										//成功后 发起付款请求
										getApp().globalData.orderId = res.data[0].id;
										var payOpenId = app.globalData.payOpenId;
										var paidMoney = res.data[0].paidMoney;
										var orderNo = res.data[0].outTradeNo;
										util.wxPay(payOpenId, paidMoney, orderNo, that, '小程序远特e卡');
									},
									fail: err => {
										console.log(err);
										that.setData({
											'tipsModelInfo.showModelStatus': true,
											'tipsModelInfo.title': '出错啦，请稍后再试~'
										});
									}
								});
							}
						}
					} else {
						wx.hideLoading();
						that.setData({
							idFaceImgPath: '../../images/idface.png',
							idBackImgPath: '../../images/idback.png',
							headImgPath: '../../images/head.png',
							idName: "",
							idCard: "",
							tipsModelInfo: {
								title: '一证五卡验证有误,请稍后再试.',
								showModelStatus: true
							},
							idFaceSuccess: false,
							idBackSuccess: false,
							headSuccess: false
						})
					}
				}
			});
		} else {
			console.log("no");
			var idFaceSuccess = this.data.idFaceSuccess,
				idBackSuccess = this.data.idBackSuccess,
				headSuccess = this.data.headSuccess;
			if (!idFaceSuccess) {
				this.setData({
					'tipsModelInfo.showModelStatus': true,
					'tipsModelInfo.title': '请上传有效的身份证正面照'
				});
				return false;
			};
			if (!idBackSuccess) {
				this.setData({
					'tipsModelInfo.showModelStatus': true,
					'tipsModelInfo.title': '请上传有效的身份证反面照'
				});
				return false;
			};
			if (!headSuccess) {
				this.setData({
					'tipsModelInfo.showModelStatus': true,
					'tipsModelInfo.title': '请上传有效的本人免冠照片'
				});
				return false;
			};

		};
	},
	//模态框返回按钮
	goBackBtn: function(e) {
		this.setData({
			'idModelInfo.showModelStatus': false,
			"photoModelInfo.showModelStatus": false,
			'tipsModelInfo.showModelStatus': false,
			idName: '',
			idCard: ''
		});
	},
	//模态框正确按钮
	confirmBtn: function(e) {
		var photoModelStatus = !this.data.photoModelInfo.showModelStatus;
		this.setData({
			"photoModelInfo.showModelStatus": photoModelStatus,
			idFaceSuccess: true
		});
	}
})
