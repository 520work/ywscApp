//app.js
App({
  globalData: {
    userInfo: null,
    idSwitch: 0,
    showModalStatus: false,
    openId: ''
  },
	/**
	 * 当小程序从前台进入后台，会触发 onHide
	 */
  onHide: function () {
    wx.clearStorage();
  },
  onLaunch: function () {
    var that = this;
    var openId = that.globalData.openId;
    if (openId != '') {
      //已获取用户openid
      //console.log("jw已获取用户openid");
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: 'https://www.m10027.com/WeChatServices/xiaochengxu.ashx?',
              data: {
                requestType: 'LoginCodeVerify',
                source: 'sc',
                code: res.code
              },
              method: 'GET',
              success: function (openIdRes) {
                that.globalData.payOpenId = openIdRes.data.info.openid;
                if (openIdRes.data.info.unionid == null || openIdRes.data.info.unionid == "" || openIdRes.data.info.unionid ==
                  undefined) {
                  //wx.showToast({
                  // 	title: '获取用户信息失败，请稍后再试。',
                  // 	icon: 'none',
                  // 	duration: 2000
                  //});
                  //提示用户获取用户信息失败
                  that.globalData.getUserInfoFail = true;
                  //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (that.getUserInfoFailCallback) {
                    that.getUserInfoFailCallback('true');
                  };
                } else {
                  wx.request({
                    url: 'https://www.m10027.com/WeChatServices/xiaochengxu.ashx?',
                    data: {
                      requestType: 'GetOpenIdForUnionId',
                      unionId: openIdRes.data.info.unionid,
                      mp: 1
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success: function (res) {
                      if (res.data.Status == true && res.data.Value != "") {
                        that.globalData.openId = res.data.Value;
                      } else {
                        //提示用户去关注远微商城公众号
                        that.globalData.isSubscribe = true;
                        //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (that.isSubscribeCallback) {
                          that.isSubscribeCallback('true');
                        };
                      }
                    },
                    fail: function (err) {
                      console.log(err);
                    }
                  });
                };
              },
              fail: function (error) {
                //wx.showToast({
                // 	title: '获取用户信息失败，请稍后再试。',
                // 	icon: 'none',
                // 	duration: 2000
                //});

                //提示用户去关注远微商城公众号
                that.globalData.isSubscribe = true;
                //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (that.isSubscribeCallback) {
                  that.isSubscribeCallback('true');
                };
              }
            })
          } else {
            //wx.showToast({
            // 	title: '登录失败！' + res.errMsg,
            // 	icon: 'none',
            // 	duration: 2000
            //});

            //提示用户去关注远微商城公众号
            that.globalData.isSubscribe = true;
            //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.isSubscribeCallback) {
              that.isSubscribeCallback('true');
            };
          }
        }
      })
    }
    //身份证是否上传总开关
    wx.request({
      url: 'https://www.m10027.com/jeewx/eCardServiceController.do?upadateKg',
      data: {
        id: '1234'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.setStorageSync('weihumsg', '抱歉，系统正在进行升级维护，给您带来的不便，请谅解！');
          wx.redirectTo({
            url: '../weihu/weihu',
          });
        };
        //kg号码直选优质套餐本月特卖 eKgs iKgs 上传身份证开关----0，关闭，1开启
        that.globalData.upadateKg = res.data[0].kg;
        that.globalData.upadateEkgs = res.data[0].ekgs;
        that.globalData.upadateIkgs = res.data[0].ikgs;
        //打开相册选项开关 xckg号码直选优质套餐本月特卖 iKg eKg ----1为开启 只能拍照 0为关闭 可拍可选
        that.globalData.xckg = res.data[0].xckg;
        that.globalData.iKg = res.data[0].iKg;
        that.globalData.eKg = res.data[0].eKg;

      },
      fail: function (err) {
        console.log(err);
        wx.setStorageSync('weihumsg', '抱歉，系统正在进行升级维护，给您带来的不便，请谅解！');
        wx.redirectTo({
          url: '../weihu/weihu',
        });
      }
    });
    //获取用户当前位置（市）
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        wx.request({
          url: 'https://www.m10027.com/WeChatServices/ServicesForCommon.ashx?requestType=Geocoder',
          data: {
            lat: latitude,
            lng: longitude
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var location = res.data.info.city.replace('市', '');
            that.globalData.city = location;
          },
          fail: err => {
            that.globalData.city = '全国';
          }
        });
      },
      fail: err => {
        that.globalData.city = '全国';
      }
    });
    //五一活动倒计时
    that.countDownGlobal();
  },
  onShow: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        console.log(res.hasUpdate);
        if (res.hasUpdate) { // 请求完新版本信息的回调
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启小程序？',
              success: function (res) {
                if (res.confirm) { // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          });
          updateManager.onUpdateFailed(function () {
            wx.showModal({ // 新的版本下载失败
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索进入哟~',
            })
          })
        }
      })
    } else {
      wx.showModal({ // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //倒计时函数
  countDownGlobal: function () {
    // 获取当前时间，同时得到活动结束时间数组 
    let newTime = new Date().getTime();
    // 对结束时间进行处理渲染到页面 
    let endTime = new Date('2019/05/10 00:00:00').getTime();
    let obj = null;
    // 如果活动未结束，对时间进行处理 
    if (endTime - newTime > 0) {
      this.globalData.huodongValid = true;
    } else {
      //活动已结束 
      this.globalData.huodongValid = false;
    };
    setTimeout(this.countDownGlobal, 1000);
  }
})
