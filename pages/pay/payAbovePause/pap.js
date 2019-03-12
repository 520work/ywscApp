// pages/pay/upto3000/upto3000.js
var util = require('../../../utils/util.js');
var ajaxUrl = util.ajaxUrl;
Page({
  onLoad: function (options) {
	var that = this;
	var qinglvhao;
	if(options.phoneNumber1 != ''){
		qinglvhao = true;
	} else {
		qinglvhao = false
	}
	that.setData({
		qinglvhao: qinglvhao,
		phoneNumber: options.phoneNumber,
		phoneNumber1: options.phoneNumber1,
		city: options.city,
		occupyMoney: options.occupyMoney,
		preDeposit: options.preDeposit,
		yhMoney: options.yhMoney,
		paidMoney: options.paidMoney,
		discountMoney: options.discountMoney,
		payOpenId: options.payOpenId,
		orderNo: options.orderNo
	})
  },
  gotoPay: function(){
	  var that = this;
	  var payOpenId = that.data.payOpenId;
	  var paidMoney = that.data.discountMoney;
	  var orderNo = that.data.orderNo;
		util.wxPay(payOpenId, paidMoney, orderNo, that);
  }
})