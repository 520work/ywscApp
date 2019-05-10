var app = getApp();
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
		//获取用户所在城市
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
		var lhSearchData = {
			city: localCity,
			number: '',
			labelType: '',
			pageIndex: 0
		};
		this.getTmCardList(lhSearchData, 'pageIn');
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
			lianghaoListData: [],
			noNum: false,
			moreNum: false,
		});
		this.searchFun(0);
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
				if (res.statusCode == 200) {
					var lianghaoData = res.data;
					var pageIndex = that.data.pageIndex;
					if (lianghaoData.length == 0) {
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
					} else if (lianghaoData.length > 0 && lianghaoData.length < 30) {
						that.setData({
							moreNum: true,
							noNum: false,
							reachBottomStatus: false,
							moreText: '暂无更多号码啦，请客官试试搜索其他内容吧~'
						});
						var lianghaoListData = that.data.lianghaoListData;
						for(var i=0; i<lianghaoData.length; i++){
							lianghaoData[i].formatTelNum = lianghaoData[i].phoneNumber.slice(0,3) + ' ' + lianghaoData[i].phoneNumber.slice(3,7) + ' ' + lianghaoData[i].phoneNumber.slice(7,11);
						};
						if (lianghaoListData == undefined) {
							that.setData({
								lianghaoListData: lianghaoData,
							});
						} else {
							var newLhArray = lianghaoListData.concat(lianghaoData);
							that.setData({
								lianghaoListData: newLhArray,
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
						var lianghaoListData = that.data.lianghaoListData;
						for(var i=0; i<lianghaoData.length; i++){
							lianghaoData[i].formatTelNum = lianghaoData[i].phoneNumber.slice(0,3) + ' ' + lianghaoData[i].phoneNumber.slice(3,7) + ' ' + lianghaoData[i].phoneNumber.slice(7,11);
						};
						if (lianghaoListData == undefined) {
							that.setData({
								lianghaoListData: lianghaoData,
								pageIndex: pageIndex
							});
						} else {
							var newLhArray = lianghaoListData.concat(lianghaoData);
							that.setData({
								lianghaoListData: newLhArray,
								pageIndex: pageIndex
							});
						}
					};
				} else {
					that.setData({
						moreNum: true,
						noNum: false,
						moreText: '请求失败，请刷新网页重试'
					});
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
	//搜索
	searchFun: function(pageIndex) {
		var newCity = this.data.city;
		var searchNumber = this.data.inputVal;
		var lhSearchData;
		if (searchNumber == undefined) {
			lhSearchData = {
				city: newCity,
				number: '',
				labelType: '',
				pageIndex: pageIndex
			};
		} else {
			lhSearchData = {
				city: newCity,
				number: searchNumber,
				labelType: '',
				pageIndex: pageIndex
			};
		};
		this.getTmCardList(lhSearchData, 'searchIn');
	},
	//点击搜索按钮
	searchBtn: function(e) {
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		this.setData({
			pageIndex: 0,
			lianghaoListData: [],
			noNum: false,
			moreNum: false,
		});
		this.searchFun(0);
	},
	//底部刷新
	onReachBottom: function(options) {
		var that = this;
		var reachBottomStatus = that.data.reachBottomStatus;
		if (reachBottomStatus) {
			that.setData({
				moreText: '加载中...'
			});
			var newPage = this.data.pageIndex;
			this.searchFun(newPage);
		}
	},
	//去套餐页
	chooseTaocan: function(e) {
		var telNum = e.currentTarget.dataset.telnum;
		getApp().globalData.ywscOrderType = '1';
		var whereFrom = e.currentTarget.dataset.wherefrom;
		var occupyMoney = e.currentTarget.dataset.occupymoney;
		util.chooseTaocan(telNum, whereFrom, occupyMoney, '', '', '', '', 'tm', 'lhtm');
	}
})
