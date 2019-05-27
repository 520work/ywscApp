//高级搜索原始选项
var selectOptionData = {
	modeOptions: [{
		name: '尾号匹配',
		code: 2
	}, {
		name: '号段匹配',
		code: 3
	}],
	haoduanOptions: [{
		name: '167',
		code: 1,
		selectStatus: true
	}, {
		name: '170',
		code: 2,
		selectStatus: true
	},{
		name: '171',
		code: 3,
		selectStatus: true
	}],
	typeOptions: [{
		name: '大众号',
		isSelected: true,
		code: 0
	}, {
		name: '预售号',
		isSelected: false,
		code: 5
	}, {
		name: '已售号',
		isSelected: false,
		code: 2
	}],
	levelOptions: [{
		name: '靓号',
		selectStatus: true,
		code: 1
	}, {
		name: '普号',
		selectStatus: true,
		code: 2
	}],
	specialOptions: [{
		name: '领导号',
		selectStatus: false,
		code: 130001
	}, {
		name: '情侣号',
		selectStatus: false,
		code: 130002
	}],
	highOptions: [{
		name: '全部',
		selectStatus: false,
		code: 1
	}, {
		name: '四连及以上',
		selectStatus: false,
		code: 100002
	}, {
		name: '对号',
		selectStatus: false,
		code: 100003
	}, {
		name: '顺子',
		selectStatus: false,
		code: 100004
	}, {
		name: 'ABCABCABC',
		selectStatus: false,
		code: 100005
	}, {
		name: 'AAAABBBBC',
		selectStatus: false,
		code: 100006
	}, {
		name: 'AAABBBBC',
		selectStatus: false,
		code: 100007
	}, {
		name: 'ABCDABCD',
		selectStatus: false,
		code: 100008
	}, {
		name: 'ABABABABAB',
		selectStatus: false,
		code: 100009
	}, {
		name: 'AAABBBCCC',
		selectStatus: false,
		code: 100019
	}, {
		name: 'AABBBBB',
		selectStatus: false,
		code: 100020
	}, {
		name: '3拖3',
		selectStatus: false,
		code: 100012
	}, {
		name: '4拖3',
		selectStatus: false,
		code: 100013
	}, {
		name: '4拖4',
		selectStatus: false,
		code: 100014
	}, {
		name: '5拖2',
		selectStatus: false,
		code: 100015
	}, {
		name: '5拖3',
		selectStatus: false,
		code: 100016
	}, {
		name: '6拖2',
		selectStatus: false,
		code: 100017
	}],
	normalOptions: [{
		name: '全部',
		selectStatus: false,
		code: 0
	}, {
		name: '小靓号',
		selectStatus: false,
		code: 100060
	}, {
		name: '三连号',
		selectStatus: false,
		code: 100023
	}, {
		name: '对号',
		selectStatus: false,
		code: 100027
	}, {
		name: '顺子',
		selectStatus: false,
		code: 100025
	}, {
		name: 'ABAB',
		selectStatus: false,
		code: 100028
	}, {
		name: 'ABABAB',
		selectStatus: false,
		code: 100029
	}, {
		name: 'ABCABC',
		selectStatus: false,
		code: 100030
	}, {
		name: 'AABAAB',
		selectStatus: false,
		code: 100036
	}, {
		name: 'ABBABB',
		selectStatus: false,
		code: 100037
	}, {
		name: 'AABBB',
		selectStatus: false,
		code: 100038
	}, {
		name: '3拖2',
		selectStatus: false,
		code: 100031
	}, {
		name: '3拖3',
		selectStatus: false,
		code: 100032
	}, {
		name: '4拖2',
		selectStatus: false,
		code: 100033
	}, {
		name: '4拖3',
		selectStatus: false,
		code: 100034
	}, {
		name: '5拖2',
		selectStatus: false,
		code: 100035
	}],
	stepOptions: [{
		name: '100以下',
		selectStatus: false,
		code: 100049
	}, {
		name: '100~500',
		selectStatus: false,
		code: 100050
	}, {
		name: '500~1000',
		selectStatus: false,
		code: 100051
	}, {
		name: '1000~5000',
		selectStatus: false,
		code: 100052
	}, {
		name: '5000~10000',
		selectStatus: false,
		code: 100053
	}, {
		name: '1万以上',
		selectStatus: false,
		code: 100054
	}],
	moreNumOptions: [{
		name: '0较多',
		selectStatus: false,
		code: 100039
	}, {
		name: '1较多',
		selectStatus: false,
		code: 100040
	}, {
		name: '2较多',
		selectStatus: false,
		code: 100041
	}, {
		name: '3较多',
		selectStatus: false,
		code: 100042
	}, {
		name: '4较多',
		selectStatus: false,
		code: 100043
	}, {
		name: '5较多',
		selectStatus: false,
		code: 100044
	}, {
		name: '6较多',
		selectStatus: false,
		code: 100045
	}, {
		name: '7较多',
		selectStatus: false,
		code: 100046
	}, {
		name: '8较多',
		selectStatus: false,
		code: 100047
	}, {
		name: '9较多',
		selectStatus: false,
		code: 100048
	}]
};
//高级搜索原始请求参数
var hsQueryData = {
	city: '',
	number: '',
	ssfs: '2',
	hdss:'1,2,3',
	hmlx: '0',
	hmdj: '1,2',
	special_type: '',
	jgqj: '',
	jdws: '',
	bhsw: '',
	pageIndex: '0',
	code: ''
};
//靓号号特卖套餐数据
var lhtcData = {
	"code": "200",
	"Content": {
		"cardType": "1",
		"cardNum": "17074723355",
		"card_money": "8000",
		"incard_money": "0",
		"BasicPackageList": [{
			"PackageTitle": "优享随心配<br/>0.12元/分钟",
			"necessary": "0",
			"PackageList": [{
				"code": "1353166",
				"package_name": "全国流量",
				"title": "全国流量",
				"standard": {
					"taocanname": "2019优享随心配",
					"taocanyuezu": "9元/月",
					"guoneiliuliang": "1元600M超出两元不限用",
					"guoneiyuyin": "0.12/分钟"
				},
				"fee_describe": "套餐月租：9元/月<br/><br/>套餐内包含：来电显示：赠送，国内语音接听：免费<br/><br/>套餐外资费：<br/>国内语音：0.12元/分钟；国内短信：0.1元/条；国内彩信：0.3元/条；全国流量：1元600M超出两元不限用，每日自动续订，不使用不扣费（不含港澳台），当日超出600M后自动续订全国3元/日流量不限量；<br/><br/>资费说明：<br/>1、优享随心配赠送来电显示，全国免费接听；<br/>2、全国流量1元/日/600M，每日自动续订，不使用不扣费（不含港澳台），当日超出600M后自动续订全国3元/日流量不限量；可取消，取消后按国内流量0.2元/M计费；<br/>3、用户可通过业务办理订购1元/日/600M流量包，立即生效，每日自动续订，当日超出600M后自动续订全国3元/日不限量流量，可取消日包，次日生效，取消后按国内流量0.2元/M计费；<br/>4、全国语音拨打0.12元/分钟，短信0.1元/条；彩信0.3元/条；<br/>5、用户入网默认开通国内语音主被叫（不含港澳台）、短彩信、手机上网、来电显示、可视电话等。国际及港澳台等其他业务默认关闭；<br/>6、新用户入网，不区分入网时间，入网即收取当月月费；<br/>7、每月1日到3日扣取当月月租；<br/>8、此套餐新老用户均可选择订购，每月最后一天18:00之后无法变更套餐，老用户可于每月最后一天18:00之前变更套餐，变更套餐次月生效，新用户当月有效；<br/>10、部分特殊号码不可选此套餐；",
				"deposit_money": [30000],
				"necessary": 0,
				"Optional_package": [{
					"code": "1353165",
					"package_name": "1元/日/600M超出2元不限用",
					"standard": "1元/天",
					"necessary": "1",
					"relevant_opt_package": "",
					"fee_describe": "1、优享随心配专用流量包，1元/日/600M，每日自动续订，不使用不扣费（不含港澳台），可取消；<br/>2、当日流量使用超出600M后自动订购全国3元流量升级包。即3元/天流量不限用，自动订购的全国3元流量升级包当天有效，次日流量超出后重新订购。"
				},{
					"code": "1353246",
					"package_name": "友情可选包",
					"standard":"2019年5月17日- 2019年8月31日，订购可享3折优惠，3元/月",
					"necessary": "1",
					"relevant_opt_package": "",
					"fee_describe": "1. 友情可选包包含全国地市1709/1708/1707/1704/171/167/后续申请联通转售新号段互相拨打语音免费，无语音分钟数上限；<br/>2. 资费及订购：3元/月，除无限时空49元档套餐以外其他产品均可订购；<br/>3. 有效期：1个月，默认自动续订；<br/>4. 生效方式：当日订购立即生效，当日退订立即生效；<br/>5. 每月最后一天18：00后不可订购。"
				}]
			}]
		}]
	}
};
//情侣号特卖套餐数据
var qinglvData = {
	"code": "200",
	"Content": {
		"cardType": "1",
		"cardNum": "17074723355",
		"card_money": "8000",
		"incard_money": "0",
		"BasicPackageList": [{
			"PackageTitle": "优享随心配<br/>0.12元/分钟",
			"necessary": "0",
			"PackageList": [{
				"code": "1353166",
				"package_name": "全国流量",
				"title": "全国流量",
				"standard": {
					"taocanname": "2019优享随心配",
					"taocanyuezu": "9元/月",
					"guoneiliuliang": "1元600M超出两元不限用",
					"guoneiyuyin": "0.12/分钟"
				},
				"fee_describe": "套餐月租：9元/月<br/><br/>套餐内包含：来电显示：赠送，国内语音接听：免费<br/><br/>套餐外资费：<br/>国内语音：0.12元/分钟；国内短信：0.1元/条；国内彩信：0.3元/条；全国流量：1元/日/600M，每日自动续订，不使用不扣费（不含港澳台），当日超出600M后自动续订全国2元/日流量不限量；<br/><br/>资费说明：<br/>1、优享随心配赠送来电显示，全国免费接听；<br/>2、全国流量1元/日/600M，每日自动续订，不使用不扣费（不含港澳台），当日超出600M后自动续订全国3元/日流量不限量；可取消，取消后按国内流量0.2元/M计费；<br/>3、用户可通过业务办理订购1元/日/600M流量包，立即生效，每日自动续订，当日超出600M后自动续订全国3元/日不限量流量，可取消日包，次日生效，取消后按国内流量0.2元/M计费；<br/>4、全国语音拨打0.12元/分钟，短信0.1元/条；彩信0.3元/条；<br/>5、用户入网默认开通国内语音主被叫（不含港澳台）、短彩信、手机上网、来电显示、可视电话等。国际及港澳台等其他业务默认关闭；<br/>6、新用户入网，不区分入网时间，入网即收取当月月费；<br/>7、每月1日到3日扣取当月月租；<br/>8、此套餐新老用户均可选择订购，每月最后一天18:00之后无法变更套餐，老用户可于每月最后一天18:00之前变更套餐，变更套餐次月生效，新用户当月有效；<br/>10、部分特殊号码不可选此套餐；",
				"deposit_money": [2000, 5000, 10000, 20000, 30000],
				"necessary": 0,
				"Optional_package": [{
					"code": "1353165",
					"package_name": "1元600M超出2元不限用",
					"standard": "1元/天",
					"necessary": "1",
					"relevant_opt_package": "",
					"fee_describe": "1、优享随心配专用流量包，1元/日/600M，每日自动续订，不使用不扣费（不含港澳台），可取消；<br/>2、当日流量使用超出600M后自动订购全国3元流量升级包。即3元/天流量不限用，自动订购的全国3元流量升级包当天有效，次日流量超出后重新订购。"
				},{
					"code": "1353246",
					"package_name": "友情可选包",
					"standard":"2019年5月17日- 2019年8月31日，订购可享3折优惠，3元/月",
					"necessary": "1",
					"relevant_opt_package": "",
					"fee_describe": "1. 友情可选包包含全国地市1709/1708/1707/1704/171/167/后续申请联通转售新号段互相拨打语音免费，无语音分钟数上限；<br/>2. 资费及订购：3元/月，除无限时空49元档套餐以外其他产品均可订购；<br/>3. 有效期：1个月，默认自动续订；<br/>4. 生效方式：当日订购立即生效，当日退订立即生效；<br/>5. 每月最后一天18：00后不可订购。"
				}]
			}]
		}, {
			"PackageTitle": "无限时空系列<br/>0.12元/分钟",
			"necessary": "0",
			"PackageList": [{
				"code": "1353171",
				"package_name": "全国流量40G<br/>69元/月",
				"title": "全国流量40G<br/>69元/月",
				"standard": {
					"taocanname": "2019无限时空69元档",
					"taocanyuezu": "69元/月",
					"guoneiliuliang": "40GB",
					"guoneiyuyin": "500分钟"
				},
				"fee_describe": "套餐月租：69元/月<br/><br/>套餐内包含：国内流量：40GB；国内语音：500分钟；来电显示：赠送；国内语音接听：免费；<br/><br/>套餐外资费：国内语音：0.12元/分钟；国内短信：0.1元/条；国内彩信：0.3元/条。<br/><br/>资费说明：<br/>1、全国范围免费接听，赠送来电显示；<br/>2、全国语音拨打0.12元/分钟，套外全国流量3元/日不限量流量，每日自动续订，流量日包不可取消，短信0.1元/条；<br/>3、用户入网默认开通国内语音主被叫（不含港澳台）、短彩信、手机上网、来电显示、可视电话等。国际及港澳台等其他业务默认关闭；<br/>4、套内语音、流量当月有效，月末24:00自动清零；<br/>5、新用户入网，每月16日之前激活，当月收取全月月费，套内资源为套内全部资源，每月16日及以后激活，当月收取半月月费，套内内资源为原套餐含量的一半，激活次月恢复原套餐含量及月费；<br/>6、每月1日到3日扣取当月月租；<br/>7、此套餐新老用户均可选择订购，每月最后一天18:00之后无法变更套餐，老用户可于每月最后一天18:00之前变更套餐，变更套餐次月生效，新用户当月有效；<br/>8、每月最后一天18:00后无法办理。",
				"deposit_money": [20000, 30000],
				"necessary": 0,
				"Optional_package": [{
					"code": "1353246",
					"package_name": "友情可选包",
					"standard":"2019年5月17日- 2019年8月31日，订购可享3折优惠，3元/月",
					"necessary": "1",
					"relevant_opt_package": "",
					"fee_describe": "1. 友情可选包包含全国地市1709/1708/1707/1704/171/167/后续申请联通转售新号段互相拨打语音免费，无语音分钟数上限；<br/>2. 资费及订购：3元/月，除无限时空49元档套餐以外其他产品均可订购；<br/>3. 有效期：1个月，默认自动续订；<br/>4. 生效方式：当日订购立即生效，当日退订立即生效；<br/>5. 每月最后一天18：00后不可订购。"
				}]
			}, {
				"code": "1353170",
				"package_name": "全国流量20G<br/>49元/月",
				"title": "全国流量20G<br/>49元/月",
				"standard": {
					"taocanname": "2019无限时空49元档",
					"taocanyuezu": "49元/月",
					"guoneiliuliang": "20GB",
					"guoneiyuyin": "200分钟"
				},
				"fee_describe": "套餐月租：49元/月<br/><br/>套餐内包含：国内流量：20GB；国内语音：200分钟；来电显示：赠送；国内语音接听：免费；<br/><br/>套餐外资费：国内语音：0.12元/分钟；国内短信：0.1元/条；国内彩信：0.3元/条。<br/><br/>资费说明：<br/>1、全国范围免费接听，赠送来电显示；<br/>2、全国语音拨打0.12元/分钟，套外全国流量3元/日不限量流量，每日自动续订，流量日包不可取消，短信0.1元/条；<br/>3、用户入网默认开通国内语音主被叫（不含港澳台）、短彩信、手机上网、来电显示、可视电话等。国际及港澳台等其他业务默认关闭；<br/>4、套内语音、流量当月有效，月末24:00自动清零；<br/>5、新用户入网，每月16日之前激活，当月收取全月月费，套内资源为套内全部资源，每月16日及以后激活，当月收取半月月费，套内内资源为原套餐含量的一半，激活次月恢复原套餐含量及月费；<br/>6、每月1日到3日扣取当月月租；<br/>7、此套餐新老用户均可选择订购，每月最后一天18:00之后无法变更套餐，老用户可于每月最后一天18:00之前变更套餐，变更套餐次月生效，新用户当月有效；<br/>8、每月最后一天18:00后无法办理。",
				"deposit_money": [20000, 30000],
				"necessary": 0,
				"Optional_package": []
			}, {
				"code": "1353172",
				"package_name": "全国流量不限用<br/>99元/月",
				"title": "全国流量不限用<br/>99元/月",
				"standard": {
					"taocanname": "2019无限时空99元档",
					"taocanyuezu": "99元/月",
					"guoneiliuliang": "全国流量不限用",
					"guoneiyuyin": "1000分钟"
				},
				"fee_describe": "套餐月租：99元/月<br/><br/>套餐内包含：国内流量：全国流量不限用；国内语音：1000分钟；来电显示：赠送；国内语音接听：免费；<br/><br/>套餐外资费：国内语音：0.12元/分钟；国内短信：0.1元/条；国内彩信：0.3元/条。<br/><br/>资费说明：<br/>1、全国范围免费接听，赠送来电显示；<br/>2、全国语音拨打0.12元/分钟，套外全国流量3元/日不限量流量，每日自动续订，流量日包不可取消，短信0.1元/条；<br/>3、用户入网默认开通国内语音主被叫（不含港澳台）、短彩信、手机上网、来电显示、可视电话等。国际及港澳台等其他业务默认关闭；<br/>4、套内语音、流量当月有效，月末24:00自动清零；<br/>5、新用户入网，每月16日之前激活，当月收取全月月费，套内资源为套内全部资源，每月16日及以后激活，当月收取半月月费，套内内资源为原套餐含量的一半，激活次月恢复原套餐含量及月费；<br/>6、每月1日到3日扣取当月月租；<br/>7、此套餐新老用户均可选择订购，每月最后一天18:00之后无法变更套餐，老用户可于每月最后一天18:00之前变更套餐，变更套餐次月生效，新用户当月有效；<br/>8、每月最后一天18:00后无法办理。",
				"deposit_money": [30000],
				"necessary": 0,
				"Optional_package": [{
					"code": "1353246",
					"package_name": "友情可选包",
					"standard":"2019年5月17日- 2019年8月31日，订购可享3折优惠，3元/月",
					"necessary": "1",
					"relevant_opt_package": "",
					"fee_describe": "1. 友情可选包包含全国地市1709/1708/1707/1704/171/167/后续申请联通转售新号段互相拨打语音免费，无语音分钟数上限；<br/>2. 资费及订购：3元/月，除无限时空49元档套餐以外其他产品均可订购；<br/>3. 有效期：1个月，默认自动续订；<br/>4. 生效方式：当日订购立即生效，当日退订立即生效；<br/>5. 每月最后一天18：00后不可订购。"
				}]
			}, {
				"code": "1353168",
				"package_name": "1元每天不限用<br/>19元/月",
				"title": "1元每天不限用<br/>19元/月",
				"standard": {
					"taocanname": "2019无限时空19元档",
					"taocanyuezu": "19元/月",
					"guoneiliuliang": "1元/日/不限用",
					"guoneiyuyin": "0.12元/分钟"
				},
				"fee_describe": "套餐月租：19元/月套餐内包含：来电显示：赠送；国内语音接听：免费；套餐外资费：国内语音：0.12元/分钟；国内短信：0.1元/条；国内彩信：0.3元/条；全国流量：1元/日/流量不限用资费说明：1、全国范围免费接听，赠送来电显示；2、全国语音拨打0.12元/分钟，全国1元/日/流量不限用，每月累计使用到20G限速至128kb；流量日包不可取消订购；短信0.1元/条；3、流量限速后，可订购3元/日不限量，立即生效，每日自动续订，可取消，次日生效，取消后降速至128kb；4、用户入网默认开通国内语音主被叫（不含港澳台）、短彩信、手机上网、来电显示、可视电话等。国际及港澳台等其他业务默认关闭；5、新用户入网，每月16日之前激活，当月收取全月月费，每月16日及以后激活，当月收取半月月费；6、每月1日到3日扣取当月月租；7、此套餐新老用户均可选择订购，每月最后一天18:00之后无法变更套餐，老用户可于每月最后一天18:00之前变更套餐，变更套餐次月生效，新用户当月有效；8、部分特殊号码不可选此套餐；",
				"deposit_money": [30000],
				"necessary": 1,
				"Optional_package": [{
					"code": "1353180",
					"package_name": "1元/天不限用日包",
					"standard": "1元/天",
					"necessary": "2",
					"relevant_opt_package": "",
					"fee_describe": "1、无限时空19元无限版套餐专用流量包，1元/天流量不限用；<br/>2、当月累计使用超过20GB后，上网速度降至128Kb。可通过业务办理订购3元流量升速包。"
				},{
					"code": "1353246",
					"package_name": "友情可选包",
					"standard":"2019年5月17日- 2019年8月31日，订购可享3折优惠，3元/月",
					"necessary": "1",
					"relevant_opt_package": "",
					"fee_describe": "1. 友情可选包包含全国地市1709/1708/1707/1704/171/167/后续申请联通转售新号段互相拨打语音免费，无语音分钟数上限；<br/>2. 资费及订购：3元/月，除无限时空49元档套餐以外其他产品均可订购；<br/>3. 有效期：1个月，默认自动续订；<br/>4. 生效方式：当日订购立即生效，当日退订立即生效；<br/>5. 每月最后一天18：00后不可订购。"
				}]
			}]
		}]
	}
};
module.exports = {
	selectOptionData: selectOptionData,
	hsQueryData: hsQueryData,
	lhtcData: lhtcData,
	qinglvData: qinglvData
};
