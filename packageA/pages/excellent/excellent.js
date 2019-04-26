// pages/excellent/excellent.js
Page({
	data: {
		introduce1: true,
		introduce2: false,
		datacode: 1353242,
		toggleText: '查看全部',
		toggleImgSrc: '../../images/51/down.png',
		showZfsm: false,
		showRuleModel: false,
		countDownList: {
			day: '00',
			hou: '00',
			min: '00',
			sec: '00'
		}
	},
	onLoad: function(options) {
		var that = this;
		that.setData({
			code: options.code
		});
		//五一活动倒计时
		that.countDown();
	},
	chooseFisrt: function(e) {
		var introduce1 = !this.data.introduce1;
		var introduce2 = !this.data.introduce2;
		this.setData({
			introduce1: introduce1,
			introduce2: introduce2,
			datacode: 1353242
		})
	},
	chooseSecond: function(e) {
		var introduce1 = !this.data.introduce1;
		var introduce2 = !this.data.introduce2;
		this.setData({
			introduce1: introduce1,
			introduce2: introduce2,
			datacode: 1353243
		})
	},
	goToChooseNum: function(e) {
		wx.navigateTo({
			url: '../../../pages/chooseNum/chooseNum?code=' + this.data.code + '&datacode=' + this.data.datacode
		});
	},
	toggleZfsm: function(e) {
		if (this.data.showZfsm == false) {
			this.setData({
				showZfsm: true,
				toggleText: '收起',
				toggleImgSrc: '../../images/51/up.png',
			})
		} else {
			this.setData({
				showZfsm: false,
				toggleText: '查看全部',
				toggleImgSrc: '../../images/51/down.png'
			})
		}
	},
	openHdRule: function(e) {
		this.setData({
			showRuleModel: true
		})
	},
	closeHdRule: function(e) {
		this.setData({
			showRuleModel: false
		})
	},
	timeFormat: function(param) {
		//小于10的格式化函数 
		return param < 10 ? '0' + param : param;
	},
	//倒计时函数
	countDown: function() {
		// 获取当前时间，同时得到活动结束时间数组 
		let newTime = new Date().getTime();
		// 对结束时间进行处理渲染到页面 
		let endTime = new Date('2019/05/10 00:00:00').getTime();
		let obj = null;
		// 如果活动未结束，对时间进行处理 
		if (endTime - newTime > 0) {
			let time = (endTime - newTime) / 1000;
			// 获取天、时、分、秒 
			let day = parseInt(time / (60 * 60 * 24));
			let hou = parseInt(time % (60 * 60 * 24) / 3600);
			let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
			let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
			obj = {
				day: this.timeFormat(day),
				hou: this.timeFormat(hou),
				min: this.timeFormat(min),
				sec: this.timeFormat(sec)
			}
		} else {
			//活动已结束，全部设置为'00' 
			obj = {
				day: '00',
				hou: '00',
				min: '00',
				sec: '00'
			}
		};
		// 渲染，然后每隔一秒执行一次倒计时函数 
		this.setData({
			countDownList: obj
		});
		setTimeout(this.countDown, 1000);
	}
})
