// pages/lhtm/lhtm.js
var util = require('../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		inputVal: "",
		provinces: [],
		province: "",
		citys: [],
		city: "",
		countys: [],
		county: '',
		value: [0, 0, 0],
		values: [0, 0, 0],
		condition: false,
		pageIndex: 0,
		moreText: '上拉加载更多',
		reachBottomStatus: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var that = this;
		var localCity = wx.getStorageSync('city');
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
		util.getUserLocation(that);
		var qlSearchData = {
			city: localCity,
			number: '',
			labelType: 'q',
			pageIndex: 0
		};
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		this.getTmCardList(qlSearchData, 'pageIn');
		// util.getUserLocation(that);
	},
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
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		this.setData({
			condition: !this.data.condition,
			pageIndex: 0,
			qinglvListData: [],
			noNum: false,
			moreNum: false,
		});
		this.searchFun(0);
	},
	//搜索
	searchFun: function(pageIndex) {
		var newCity = this.data.city;
		var searchNumber = this.data.inputVal;
		var qlSearchData;
		if (searchNumber == undefined) {
			qlSearchData = {
				city: newCity,
				number: '',
				labelType: 'q',
				pageIndex: pageIndex
			};
		} else {
			qlSearchData = {
				city: newCity,
				number: searchNumber,
				labelType: 'q',
				pageIndex: pageIndex
			};
		};
		this.getTmCardList(qlSearchData, 'searchIn');
	},
	//点击搜索按钮
	searchBtn: function(e) {
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		this.setData({
			pageIndex: 0,
			qinglvListData: [],
			noNum: false,
			moreNum: false,
		});
		this.searchFun(0);

	},
	//底部刷新
	onReachBottom: function(options) {
		var that = this;
		var reachBottomStatus = that.data.reachBottomStatus;
		if(reachBottomStatus){
			that.setData({
				moreText: '加载中...'
			});
			var newPage = this.data.pageIndex;
			this.searchFun(newPage);
		}
	},
	getTmCardList: function(searchData, searchType) {
		var that = this;
		wx.request({
			url: ajaxUrl + 'cardServiceController.do?tMCardList',
			method: 'POST',
			data: searchData,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function(res) {
				var qinglvData = res.data;
				var pageIndex = that.data.pageIndex;
				if (qinglvData.length == 0) {
					//初始化进入没数据
					if (searchType == 'pageIn') {
						that.setData({
							noNum: true,
							moreNum: false,
							time: 5
						});
						//重新搜索倒计时
						var setTime;
						var time = that.data.time;
						setTime = setInterval(function() {
							if (time <= 0) {
								clearInterval(setTime);
								var searchData = {
									city: '全国',
									number: '',
									pageIndex: '0',
									code: that.data.code
								};
								wx.showLoading({
									mask: true,
									title: '加载中'
								});
								that.setData({
									city: '全国',
									moreNum: false,
									noNum: false,
								});
								that.getTmCardList(searchData, 'searchIn');
							}
							time--;
							that.setData({
								time: time
							});
						}, 1000);
					} else if (searchType == 'searchIn') {
						that.setData({
							moreNum: true,
							noNum: false,
							reachBottomStatus: false,
							moreText: '暂无更多号码啦，请客官试试搜索其他内容吧~'
						});
					};
				} else if (qinglvData.length > 0 && qinglvData.length < 30) {
					that.setData({
						moreNum: true,
						noNum: false,
						reachBottomStatus: false,
						moreText: '暂无更多号码啦，请客官试试搜索其他内容吧~'
					});
					var qinglvListData = that.data.qinglvListData;
					if (qinglvListData == undefined) {
						that.formatTelNum(qinglvData);
						that.setData({
							qinglvListData: qinglvData
						});
					} else {
						that.formatTelNum(qinglvData);
						var newLhArray = qinglvListData.concat(qinglvData);

						that.setData({
							qinglvListData: newLhArray
						});
					}
				} else {
					that.setData({
						moreNum: true,
						noNum: false,
						reachBottomStatus: true,
						moreText: '上拉加载更多'
					});
					pageIndex++;
					var qinglvListData = that.data.qinglvListData;
					if (qinglvListData == undefined) {
						that.formatTelNum(qinglvData);
						that.setData({
							qinglvListData: qinglvData,
							pageIndex: pageIndex
						});
					} else {
						that.formatTelNum(qinglvData);
						var newLhArray = qinglvListData.concat(qinglvData);

						that.setData({
							qinglvListData: newLhArray,
							pageIndex: pageIndex
						});
					}
				};
			},
			fail: function(err) {
				wx.showToast({
					title: '请求失败，请刷新网页重试',
					icon: 'none',
					duration: 2000
				});
				that.setData({
					moreNum: true,
					noNum: false,
					moreText: '请求失败，请刷新网页重试'
				});
			},
			complete: res => {
				wx.hideLoading();
			}
		});
	},
	//去套餐页
	chooseTaocan: function(e) {
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
	//格式化情侣号码
	formatTelNum: function(numData) {
		for (var i = 0; i < numData.length; i++) {
			var phoneNum1 = numData[i].phoneNumber;
			var phoneNum1left = numData[i].phoneNumber.slice(0, 3) + " " + numData[i].phoneNumber.slice(3, 7) +
				" " + numData[i].phoneNumber.slice(7, 8);
			var phoneNum1right = numData[i].phoneNumber.slice(8, 11);
			var phoneNum2 = numData[i].phoneNumber1;
			var phoneNum2left = numData[i].phoneNumber1.slice(0, 3) + " " + numData[i].phoneNumber1.slice(3, 7) +
				" " + numData[i].phoneNumber1.slice(7, 8);
			var phoneNum2right = numData[i].phoneNumber1.slice(8, 11);
			numData[i].phoneNum1left = phoneNum1left;
			numData[i].phoneNum1right = phoneNum1right;
			numData[i].phoneNum2left = phoneNum2left;
			numData[i].phoneNum2right = phoneNum2right;
		};
		return numData;
	}
})
