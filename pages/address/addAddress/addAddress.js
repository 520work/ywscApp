var app = getApp();
var tcity = require('../../../utils/city.js');
var util = require('../../../utils/util.js');
var ajaxUrl = util.ajaxUrl;

Page({
	//数据
	data: {
		provinces: [],
		province: "",
		citys: [],
		city: "",
		countys: [],
		county: '',
		value: [0, 0, 0],
		values: [0, 0, 0],
		condition: false,
		editData: {
			contacts: '',
			phonenumber: '',
			street: ''
		}
	},
	//点击piker
	bindChange: util.bindChange,
	//打开或者关闭piker
	open: util.openAddressModel,
	//获取收货人信息
	getContacts: function(e) {
		this.setData({
			"editData.contacts": e.detail.value
		});
	},
	//获取联系电话信息
	getPhoneNumber: function(e) {
		this.setData({
			"editData.phonenumber": e.detail.value
		});
	},
	//获取街道信息
	getStreet: function(e) {
		this.setData({
			"editData.street": e.detail.value
		});
	},
	//保存地址
	saveNewAddress: function() {
		var contacts = this.data.editData.contacts;
		if (contacts.length == 0) {
			wx.showToast({
				title: '请填写收货人姓名',
				icon: 'none',
				duration: 2000
			});
			return false;
		};
		var phonenumber = this.data.editData.phonenumber;
		if (phonenumber.length == 0) {
			wx.showToast({
				title: '请填联系电话',
				icon: 'none',
				duration: 2000
			});
			this.setData({
				'editData.phonenumber': ''
			});
			return false;
		};
		var regNum = /^[0-9]+.?[0-9]*$/;
		if (!regNum.test(phonenumber)) {
			wx.showToast({
				title: '联系电话格式有误，请重新输入',
				icon: 'none',
				duration: 2000
			});
			this.setData({
				'editData.phonenumber': ''
			});
			return false;
		};
		var address = this.data.province + " " + this.data.city + " " + this.data.county;
		var street = this.data.editData.street;
		if (street.length == 0) {
			wx.showToast({
				title: '请填详细地址',
				icon: 'none',
				duration: 2000
			});
			return false;
		};
		var openId = app.globalData.payOpenId;
		if (this.data.editDataStatus) {
			var id = this.data.editData.id
		} else {
			var id = ""
		};
		wx.request({
			url: ajaxUrl + 'userAddressController.do?addAddress',
			method: 'POST',
			data: {
				id: id,
				openid: openId,
				contacts: contacts,
				phonenumber: phonenumber,
				address: address,
				street: street
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function(res) {
				wx.navigateBack({
					delta: 1
				});
			},
			fail: function(err) {
				wx.showToast({
					title: '保存失败，请稍后重试。',
					icon: 'none',
					duration: 2000
				});
			}
		});
	},
	onLoad: function(options) {
		if (options.editStatus) {
			var editData = app.globalData.editData;
			var addressArr = editData.address.split(" ");
			console.log(addressArr);
			this.setData({
				editDataStatus: true,
				editData: editData,
				province: addressArr[0],
				city: addressArr[1],
				county: addressArr[2]
			});
		};
		var that = this;
		util.initAddress(that, tcity);
	}
})
