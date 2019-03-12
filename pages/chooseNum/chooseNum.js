var app = getApp();
var util = require('../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({
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
		tipsModelInfo: {
			title: '',
			btn: '确定',
			showModelStatus: false
		},
		searchMode: "highSearch",
		searchText: "高级搜索",
		reachBottomStatus: true
	},
	onLoad: function(options) {
		var that = this;
		var code = options.code;
		var datacode = options.datacode;
		if (!code) {
			code = '';
		};
		var datacode = options.datacode;
		if (!datacode) {
			datacode = '';
		};

		that.setData({
			code: code,
			datacode: datacode
		});
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
		//获取用户所在地区
		// util.getUserLocation(that);
		var searchData = {
			city: localCity,
			number: '',
			pageIndex: '0',
			code: that.data.code
		};
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		that.getHmzxCardList(searchData, "pageIn");
	},
	onShow: function() {
		var that = this;
		var hsQueryData = app.globalData.hsQueryData;
		if (hsQueryData) {
			console.log(hsQueryData);
			this.setData({
				pageIndex: 0,
				numListData: [],
				noNum: false,
				moreNum: false,
			});
			wx.showLoading({
				mask: true,
				title: '加载中'
			});
			that.screenCardFun(hsQueryData);
		};
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
		if (nubmer.length < 4) {
			this.setData({
				searchMode: "highSearch",
				searchText: "高级搜索"
			});
		} else {
			this.setData({
				searchMode: "normalSearch",
				searchText: "搜索"
			});
		}
	},
	makeSure: function(e) {
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		this.setData({
			condition: !this.data.condition,
			pageIndex: 0,
			numListData: [],
			noNum: false,
			moreNum: false,
		});
		this.searchFun(0);
	},
	//号码直选首页展示接口
	getHmzxCardList: function(searchData, searchType) {
		var that = this;
		wx.request({
			url: ajaxUrl + 'xbCardServiceController.do?xbcardIndex',
			method: 'POST',
			data: searchData,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				wx.hideLoading();
				var numData = res.data;
				var pageIndex = that.data.pageIndex;
				if (numData.length == 0) {
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
								that.getHmzxCardList(searchData, 'searchIn');
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
				} else if (numData.length > 0 && numData.length < 30){
					that.setData({
						moreNum: true,
						noNum: false,
						reachBottomStatus: false,
						moreText: '暂无更多号码啦，请客官试试搜索其他内容吧~'
					});
					that.handleData(numData, pageIndex, that);
				} else {
					that.handleData(numData, pageIndex, that);
				};
			},
			fail: err => {
				wx.hideLoading();
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
			}
		});
	},
	//号码筛选查询接口
	screenCardFun: function(queryData) {
		var that = this;
		wx.request({
			url: ajaxUrl + 'zbCardServiceController.do?screenCard',
			method: 'POST',
			data: queryData,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: res => {
				console.log(res);
				wx.hideLoading();
				var numData = res.data;
				if (numData == 0) {
					that.setData({
						moreNum: true,
						noNum: false,
						moreText: '暂无更多号码啦，请客官试试搜索其他内容吧~'
					});
				} else {
					var pageIndex = that.data.pageIndex;
					that.handleData(numData, pageIndex, that);
				}
			},
			fail: err => {
				wx.hideLoading();
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
			}
		});
	},
	//对请求的数据进行处理
	handleData: function(numData, pageIndex, that) {
		that.setData({
			moreNum: true,
			noNum: false,
			reachBottomStatus: true,
			moreText: '上拉加载更多'
		});
		pageIndex++;
		var numListData = that.data.numListData;
		for (var i = 0; i < numData.length; i++) {
			var originalOccupyMoney = numData[i].occupyMoney;
			var formatOccupyMoney = that.keepTwoFloor(originalOccupyMoney);
			numData[i].occupyMoney = formatOccupyMoney;
		};
		if (numListData == undefined) {
			that.setData({
				numListData: numData,
				pageIndex: pageIndex
			});
		} else {
			var newLhArray = numListData.concat(numData);
			that.setData({
				numListData: newLhArray,
				pageIndex: pageIndex
			});
		}
	},
	//搜索
	searchFun: function(pageIndex) {
		var newCity = this.data.city;
		var searchNumber = this.data.inputVal;
		var searchData;
		if (searchNumber == undefined) {
			searchData = {
				city: newCity,
				number: '',
				pageIndex: pageIndex
			};
		} else {
			searchData = {
				city: newCity,
				number: searchNumber,
				pageIndex: pageIndex,
				code: this.data.code
			};
		};
		this.getHmzxCardList(searchData, 'searchIn');
	},
	//点击放大镜进行搜索
	searchBtn: function(e) {
		wx.showLoading({
			mask: true,
			title: '加载中'
		});
		this.setData({
			pageIndex: 0,
			numListData: [],
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
			var hsQueryData = app.globalData.hsQueryData;
			if (hsQueryData) {
				hsQueryData.pageIndex = that.data.pageIndex;
				that.screenCardFun(hsQueryData);
			} else {
				var newPage = this.data.pageIndex;
				this.searchFun(newPage);
			};
		}
	},
	highSearchFun: function(e) {
		var city = this.data.city;
		var code = this.data.code;
		wx.navigateTo({
			url: '../highSearch/options?city=' + city + '&code=' + code
		})
	},
	//去套餐页
	chooseTaocan: function(e) {
		var cardType = e.currentTarget.dataset.cardtype;
		if (cardType == 5) {
			this.setData({
				'tipsModelInfo.title': '该号码随时上架，请及时关注',
				'tipsModelInfo.showModelStatus': true
			});
		} else if (cardType == 2) {
			this.setData({
				'tipsModelInfo.title': '该号码已售出',
				'tipsModelInfo.showModelStatus': true
			});
		} else {
			getApp().globalData.ywscOrderType = '1';
			var telNum = e.currentTarget.dataset.telnum;
			var whereFrom = e.currentTarget.dataset.wherefrom;
			var occupyMoney = e.currentTarget.dataset.occupymoney;
			var dataCode = this.data.datacode;
			util.chooseTaocan(telNum, whereFrom, occupyMoney, '', '', '', dataCode);
		};
	},
	//隐藏号码售卖状态弹窗
	goBackBtn: function(e) {
		this.setData({
			'tipsModelInfo.showModelStatus': false
		});
	},
	//保留小数点后两位
	keepTwoFloor: function(value) {
		var num = Number(value), twoFloorNum;
		if (Number.isInteger(num)) {
			twoFloorNum = Number(num).toFixed(2);
		} else {
			var numArr = num.toString().split('.');
			if(numArr[1].length>=2){
				twoFloorNum = Math.floor(num * 100) / 100;
			} else {
				twoFloorNum = Number(num).toFixed(2);
			};
		};
		return twoFloorNum;
	}
})
