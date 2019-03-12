// pages/highSearch/options/options.js
const app = getApp();
var dataBase = require('../../utils/database.js');
Page({
	data: {
		modeid: 0,
		withoutFourStatus: false,
		placeHolderText: "请至少输入4位数字",
		lianghaoShow: true,
		inputVal: ""
	},
	onLoad: function(options) {
		console.log(options);
		var city = options.city;
		var code = options.code;
		if (!city) {
			city = '全国';
		};
		if (!code) {
			code = '';
		};
		var that = this;
		var hsQueryDataStorage = app.globalData.hsQueryData;
		console.log(hsQueryDataStorage == "");
		//初始化选项数据
		that.setData({
			optionsData: dataBase.selectOptionData,
			'hsQueryData.city': city,
			'hsQueryData.code': code,
			city: city,
			code: code
		});
		if(hsQueryDataStorage == ""){
			that.setData({
				hsQueryData: dataBase.hsQueryData,
			});
			that.setData({
				'hsQueryData.city': city,
				'hsQueryData.code': code
			});
		} else {
			var optionsDataArr = this.data.optionsData;
			//搜索方式
			var ssfsValue = hsQueryDataStorage.number;
			//号码类型
			var hmlxArr = hsQueryDataStorage.hmlx.split(',');
			for(var i=0;i<hmlxArr.length;i++){
				if(hmlxArr[i] == 0){
					optionsDataArr.typeOptions[0].isSelected = true;
				} else if(hmlxArr[i] == 5){
					optionsDataArr.typeOptions[1].isSelected = true;
				}else if(hmlxArr[i] == 2){
					optionsDataArr.typeOptions[2].isSelected = true;
				}
			};
			//号码等级
			var hmdjArr = hsQueryDataStorage.hmdj.split(',');
			for(var i=0;i<hmdjArr.length;i++){
				if(hmdjArr[i] == 1){
					optionsDataArr.levelOptions[0].selectStatus = true;
				} else if(hmdjArr[i] == 2){
					optionsDataArr.levelOptions[1].selectStatus = true;
				}
			};
			//靓号选择
			var specialType = hsQueryDataStorage.special_type;
			console.log(specialType.length);
			if(specialType.length == 0){
			} else {
				//特殊靓号
				for(var i=0;i<optionsDataArr.specialOptions.length;i++){
					if(optionsDataArr.specialOptions[i].code == specialType){
						optionsDataArr.specialOptions[i].selectStatus = true;
					}
				};
				//高级靓号
				for(var i=0;i<optionsDataArr.highOptions.length;i++){
					if(optionsDataArr.highOptions[i].code == specialType){
						optionsDataArr.highOptions[i].selectStatus = true;
					}
				};
				//普通靓号
				for(var i=0;i<optionsDataArr.normalOptions.length;i++){
					if(optionsDataArr.normalOptions[i].code == specialType){
						optionsDataArr.normalOptions[i].selectStatus = true;
					}
				};
			};
			//价格区间
			var jgqjValue = hsQueryDataStorage.jgqj;
			for(var i=0;i<optionsDataArr.stepOptions.length;i++){
				if(optionsDataArr.stepOptions[i].code == jgqjValue){
					optionsDataArr.stepOptions[i].selectStatus = true;
				}
			};
			//较多数位
			var jdwsValue = hsQueryDataStorage.jdws;
			for(var i=0;i<optionsDataArr.moreNumOptions.length;i++){
				if(optionsDataArr.moreNumOptions[i].code == jdwsValue){
					optionsDataArr.moreNumOptions[i].selectStatus = true;
				}
			};
			//不含数位
			var bhswValue = hsQueryDataStorage.bhsw;
			if(bhswValue == ""){
				var withoutFourStatusValue = false;
			} else {
				var withoutFourStatusValue = true;
			};
			that.setData({
				hsQueryData: hsQueryDataStorage,
				inputVal: hsQueryDataStorage.number,
				modeid: ssfsValue,
				withoutFourStatus: withoutFourStatusValue,
				optionsData: optionsDataArr
			});
		};
	},
	//搜索数字
	input: function(e) {
		var regNum = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
		var nubmer = e.detail.value;
		if (!regNum.test(nubmer)) {
			this.setData({
				inputVal: "",
				'hsQueryData.number': ""
			});
			return false;
		}
		this.setData({
			inputVal: e.detail.value,
			'hsQueryData.number': e.detail.value
		});
	},
	//搜索方式选择
	modeSelFun: function(e) {
		var ids = e.currentTarget.dataset.id;
		var ssfsCode = e.currentTarget.dataset.code;
		var placeHolderText;
		if (ids == 0 || ids == 1) {
			placeHolderText = "请至少输入4位数字";
		} else {
			placeHolderText = "请至少输入7位数字";
		}
		this.setData({
			modeid: ids,
			'hsQueryData.ssfs': ssfsCode,
			placeHolderText: placeHolderText
		});
	},
	//号码类型选择
	typeSelFun: function(e) {
		var index = e.currentTarget.dataset.index;
		var item = this.data.optionsData.typeOptions[index];
		item.isSelected = !item.isSelected;
		var typeOptionsData = this.data.optionsData.typeOptions;
		var hmlxCodeArr = [];
		for (var i = 0; i < typeOptionsData.length; i++) {
			if (typeOptionsData[i].isSelected) {
				hmlxCodeArr.push(typeOptionsData[i].code);
			};
		};
		var hmlxCode = hmlxCodeArr.toString();
		this.setData({
			optionsData: this.data.optionsData,
			'hsQueryData.hmlx': hmlxCode,
		});
	},
	//号码等级选择
	levelSelFun: function(e) {
		var index = e.currentTarget.dataset.index; //获取当前点击的index
		var item = this.data.optionsData.levelOptions[index]; //根据index值取到对应的子项
		item.selectStatus = !item.selectStatus; //给当前点击的项目变更状态
		var levelOptionsData = this.data.optionsData.levelOptions; //拿到变更后新的数据
		var lianghao = levelOptionsData[0].selectStatus; //获取靓号状态
		var puhao = levelOptionsData[1].selectStatus; //获取普号状态
		//如果普号和靓号都未选中 则强制选择靓号
		if (!lianghao && !puhao) {
			levelOptionsData[0].selectStatus = true;
		};
		//更新数据
		this.setData({
			optionsData: this.data.optionsData
		});
		//获取到新的靓号状态
		var lianghaoStatusNew = this.data.optionsData.levelOptions[0].selectStatus;
		//如果靓号选中 则显示下面的靓号选项面板 否则不显示
		if (lianghaoStatusNew) {
			this.data.lianghaoShow = true;
		} else {
			this.data.lianghaoShow = false;
		};
		//获取code值
		var levelOptionsDataNew = this.data.optionsData.levelOptions;
		var hmdjCodeArr = [];
		for (var i = 0; i < levelOptionsDataNew.length; i++) {
			if (levelOptionsDataNew[i].selectStatus) {
				hmdjCodeArr.push(levelOptionsDataNew[i].code);
			};
		};
		var hmdjCode = hmdjCodeArr.toString();
		//更新靓号面板显示与否的标准 和 code值
		this.setData({
			lianghaoShow: this.data.lianghaoShow,
			'hsQueryData.hmdj': hmdjCode,
		});
	},
	/*
	 **靓号、价格区间、较多数位选择 规则：单选 无默认选项 且可取消当前选项
	 */
	//靓号选择
	lianghaoSelFun: function(e) {
		//获取当前选择的index
		var indexValue = e.currentTarget.dataset.index;
		var lianghaoCode = e.currentTarget.dataset.code;
		var indexArr = indexValue.split('|');
		var index = indexArr[0];
		var lianghaoType = indexArr[1];
		//特殊靓号
		var specialItem = this.data.optionsData.specialOptions[index];
		//高级靓号
		var highItem = this.data.optionsData.highOptions[index];
		//普通靓号
		var normalItem = this.data.optionsData.normalOptions[index];
		//动态改变所选项目
		if (lianghaoType == 'special') {
			this.changeSelStatus(specialItem, lianghaoCode);

		} else if (lianghaoType == 'high') {
			this.changeSelStatus(highItem, lianghaoCode);
		} else {
			this.changeSelStatus(normalItem, lianghaoCode);
		};
	},
	//改变靓号选项状态
	changeSelStatus: function(item, lianghaoCode) {
		var selectStatus = item.selectStatus;
		if (selectStatus == false) {
			//特殊靓号
			var specialOptions = this.data.optionsData.specialOptions;
			specialOptions.forEach(function(item, index) {
				item.selectStatus = false;
			});
			//高级靓号
			var highOptions = this.data.optionsData.highOptions;
			highOptions.forEach(function(item, index) {
				item.selectStatus = false;
			});
			//普通靓号
			var normalOptions = this.data.optionsData.normalOptions;
			normalOptions.forEach(function(item, index) {
				item.selectStatus = false;
			});
			item.selectStatus = !item.selectStatus;
			this.setData({
				optionsData: this.data.optionsData,
				'hsQueryData.special_type': lianghaoCode
			});
		} else {
			item.selectStatus = !item.selectStatus;
			this.setData({
				optionsData: this.data.optionsData,
				'hsQueryData.special_type': '',
			});
		};

	},
	//价格区间选择
	stepSelFun: function(e) {
		var index = e.currentTarget.dataset.index;
		var jgqjCode = e.currentTarget.dataset.code;
		console.log(jgqjCode);
		var stepOptions = this.data.optionsData.stepOptions;
		var item = this.data.optionsData.stepOptions[index];
		var selectStatus = item.selectStatus;
		if (selectStatus == false) {
			for (var i = 0; i < stepOptions.length; i++) {
				stepOptions[i].selectStatus = false;
			};
			item.selectStatus = !item.selectStatus;
			this.setData({
				optionsData: this.data.optionsData,
				'hsQueryData.jgqj': jgqjCode
			});
		} else {
			item.selectStatus = !item.selectStatus;
			this.setData({
				optionsData: this.data.optionsData,
				'hsQueryData.jgqj': ''
			});
		};
	},
	//较多数位选择选择
	moreNumSelFun: function(e) {
		var index = e.currentTarget.dataset.index;
		var jdwsCode = e.currentTarget.dataset.code;
		var moreNumOptions = this.data.optionsData.moreNumOptions;
		var item = this.data.optionsData.moreNumOptions[index];
		var selectStatus = item.selectStatus;
		if (selectStatus == false) {
			for (var i = 0; i < moreNumOptions.length; i++) {
				moreNumOptions[i].selectStatus = false;
			}
			item.selectStatus = !item.selectStatus;
			this.setData({
				optionsData: this.data.optionsData,
				'hsQueryData.jdws': jdwsCode
			});
		} else {
			item.selectStatus = !item.selectStatus;
			this.setData({
				optionsData: this.data.optionsData,
				'hsQueryData.jdws': ''
			});
		};
	},
	//不含4
	withoutFour: function(e) {
		var bhswCode = e.currentTarget.dataset.code;
		var withoutFourStatus = this.data.withoutFourStatus;
		this.setData({
			withoutFourStatus: !withoutFourStatus
		});
		if (withoutFourStatus) {
			this.setData({
				'hsQueryData.bhsw': ''
			});
		} else {
			this.setData({
				'hsQueryData.bhsw': bhswCode
			});
		};
	},
	//重置按钮
	resetBtn: function(e) {
		//初始化选项数据
		this.setData({
			optionsData: dataBase.selectOptionData,
			hsQueryData: dataBase.hsQueryData,
			'hsQueryData.city': this.data.city,
			'hsQueryData.code': this.data.code,
			modeid: 0,
			withoutFourStatus: false,
			placeHolderText: "请至少输入4位数字",
			lianghaoShow: true,
		});
	},
	//确定按钮
	confirmBtn: function(e) {
		var ssfsStatus = this.data.modeid;
		var searchNum = this.data.hsQueryData.number.length
		if (ssfsStatus == 0) {
			if (searchNum > 0 && searchNum < 4) {
				wx.showToast({
					title: '请输入至少4位数字',
					icon: 'none',
					duration: 2000
				});
			}
		} else if (ssfsStatus == 1) {
			if (searchNum > 0 && searchNum < 4) {
				wx.showToast({
					title: '请输入至少4位数字',
					icon: 'none',
					duration: 2000
				});
			}
		} else {
			if (searchNum > 0 && searchNum < 7) {
				wx.showToast({
					title: '请输入至少7位数字',
					icon: 'none',
					duration: 2000
				});
			}
		};
		getApp().globalData.hsQueryData = this.data.hsQueryData;
		wx.navigateBack({
			delta: 1
		});
	}
})
