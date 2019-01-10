var util = require('../../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		setModelInfo: {
			title: '设置成功',
			btn: '确定',
			showModelStatus: false
		},
		delDefaultModelInfo: {
			title: '默认地址不能删除哦~',
			btn: '确定',
			showModelStatus: false
		},
		delModelInfo: {
			title: '提示',
			content: '确认删除吗？',
			cancelBtn: '取消',
			confirmBtn: '确定',
			showModelStatus: false
		},
		delSuccessModel: {
			title: '删除成功',
			btn: '确定',
			showModelStatus: false
		}
	},
	//添加新地址
	addNewAddress: function() {
		wx.navigateTo({
			url: '../addAddress/addAddress'
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var that = this;
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		//获取用户地址列表
		var openId = wx.getStorageSync('openId');
		that.getAddressLists(that, openId);
	},
	onShow: function(options) {
		//获取用户地址列表
		var that = this;
		var openId = wx.getStorageSync('openId');
		that.getAddressLists(that, openId);
	},
	//获取用户地址列表
	getAddressLists: function(that, openId) {
		wx.request({
			url: ajaxUrl + 'userAddressController.do?addressList' + '&openid=' + openId,
			success: function(res) {
				wx.hideLoading();
				if (res.data == "") {
					that.setData({
						noAddress: true,
						haveAddress: false
					});
				} else {
					var addressLists = res.data;
					for (var i = 0; i < addressLists.length; i++) {
						if (addressLists[i].sort == 1) {
							that.setData({
								defaultAddress: addressLists[i]
							});
						};
					};
					for (var i = 0; i < addressLists.length; i++) {
						if (addressLists[i].sort == 0) {
							addressLists[i].checkValue = false;
						} else {
							addressLists[i].checkValue = true;
						};
					}
					that.setData({
						noAddress: false,
						haveAddress: true,
						addressLists: addressLists
					});
				};
			},
			fail: function(err) {
				wx.hideLoading();
				console.log(err);
				wx.showToast({
					title: '获取用户地址失败',
					icon: 'none',
					duration: 2000
				});
			}
		});
	},
	//设置默认地址
	checkboxChange: function(e) {
		var that = this;
		var listId = e.currentTarget.dataset.id;
		var addressLists = this.data.addressLists;
		var changeAddressData;
		for (var i = 0; i < addressLists.length; i++) {
			if (addressLists[i].id == listId) {
				changeAddressData = addressLists[i];
			};
		};
		var openId = wx.getStorageSync('openId');
		var contacts = changeAddressData.contacts;
		var phonenumber = changeAddressData.phonenumber;
		var address = changeAddressData.address;
		var street = changeAddressData.street;
		var id = changeAddressData.id;
		var sort = changeAddressData.sort;
		wx.request({
			url: ajaxUrl + 'userAddressController.do?addAddress',
			method: 'POST',
			data: {
				openid: openId,
				contacts: contacts,
				phonenumber: phonenumber,
				address: address,
				street: street,
				id: id,
				sort: 1
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function(res) {
				console.log(res);
				that.setData({
					"setModelInfo.showModelStatus": true
				});
				that.getAddressLists(that, openId);
			},
			fail: function(err) {
				console.log(err);
			}
		});
	},
	//编辑地址
	editAddress: function(e) {
		var listId = e.currentTarget.dataset.id;
		var addressLists = this.data.addressLists;
		var editAddressData;
		for (var i = 0; i < addressLists.length; i++) {
			if (addressLists[i].id == listId) {
				editAddressData = addressLists[i];
			};
		};
		wx.setStorage({
			key: "editData",
			data: editAddressData
		});
		wx.navigateTo({
			url: '../addAddress/addAddress?editStatus=true'
		});
	},
	//删除地址
	delAddress: function(e) {
		var listId = e.currentTarget.dataset.id;
		var addressLists = this.data.addressLists;
		var nodel;
		for (var i = 0; i < addressLists.length; i++) {
			if (addressLists[i].id == listId) {
				nodel = addressLists[i].sort;
			};
		};
		if (nodel == 1) {
			this.setData({
				"delDefaultModelInfo.showModelStatus": true
			});
		} else {
			this.setData({
				"delModelInfo.showModelStatus": true,
				delAddressId: listId
			});
		}
	},
	//关闭提示框
	goBackBtn: function(e) {
		this.setData({
			"setModelInfo.showModelStatus": false,
			"delDefaultModelInfo.showModelStatus": false,
			"delModelInfo.showModelStatus": false,
			"delSuccessModel.showModelStatus": false,
		});
	},
	//确认删除
	confirmBtn: function(e) {
		var that = this;
		wx.request({
			url: ajaxUrl + 'userAddressController.do?doDelAddress&id=' + this.data.delAddressId,
			success: function(res) {
				console.log(res);
				if (res.data.success) {
					that.setData({
						"delModelInfo.showModelStatus": false,
						"delSuccessModel.showModelStatus": true
					});
					var openId = wx.getStorageSync('openId');
					that.getAddressLists(that, openId);
				};
			},
			fail: function(err) {
				console.log(err);
			}
		});
	},
	selectAddress: function(e) {
		var addressData = {
			showText: "收货人：" + e.currentTarget.dataset.contacts + " " + e.currentTarget.dataset.phonenumber + " 收货地址：" + e.currentTarget
				.dataset.address + " " + e.currentTarget.dataset.street,
			contacts: e.currentTarget.dataset.contacts,
			phonenumber: e.currentTarget.dataset.phonenumber,
			userAddress: e.currentTarget.dataset.address + " " + e.currentTarget.dataset.street
		};
		wx.setStorage({
			key: "addressData",
			data: addressData
		});
		wx.navigateBack({
			delta: 1
		})
	}
})
