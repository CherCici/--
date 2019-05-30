// pages/indexx/indexx.js
//初始化云数据库
const db = wx.cloud.database({});
const scenic = db.collection('s_classify');
var app = getApp();
Page({

 

  /**
   * 页面的初始数据
   * 轮播相关设置
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    scenic_hot:[],
    cityName:"上海",
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var this_data = this;
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: "s_classify",
        pagaIndex: 1,
        pageSize: 1,
        filter: { fever: "热度 1.0" }

      }


    }).then(res => {
      

      this.setData({
        scenic_hot: res.result.data
      })

    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },

  showDialog: function () {
    this.dialog.showDialog();
  },

  confirmEvent: function () {
    this.dialog.hideDialog();
  },

  bindGetUserInfo: function () {
    // 用户点击授权后，这里可以做一些登陆操作
    this.login();
  },
  login: function () {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称 
          wx.getUserInfo({ success: function (res) { console.log(res.userInfo) } })
        }
      }
    })
  },
  
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //跳转到选折城市页面
  cityChoose:function(e){
    wx.navigateTo({
      url: '../cityChoose/city',
    })
  },
  change:function(cityName){
    this.setData({
      cityName: cityName
    })

  },
  submitOrder: function (e) {
    console.log(e)
    var scenicId = e.currentTarget.dataset._id
    wx.navigateTo({
      //title: "goback",
      url: '../scenic/scenic-detail/scenic-detail?id=' + scenicId,

    })
  },
  morehot:function(e){

      scenic.where({
        fever: "热度 1.0"

      }).get({
        success(res) {

          console.log(res)
          
  
          var fever = res.data[0].fever
          wx.navigateTo({
            //title: "goback",
            url: '../scenic?fever= ' + fever,
          })
        }
        })
  },
    bindCultural:function(e){

      scenic.where({
        type: "文化古迹"

      }).get({
        success(res) {

          console.log(res)


          var type = res.data[0].type
          wx.navigateTo({
            //title: "goback",
            url: '../scenic/scenic?type=' + type,
          })

          // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条

        }
      })
    },
  bindNation:function(){
    scenic.where({
      type: "民族特色"

    }).get({
      success(res) {

        console.log(res)
        var type = res.data[0].type
        wx.navigateTo({
          //title: "goback",
          url: '../scenic/scenic?type=' + type,
        })

        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条

      },
      
    })

  },
  bindRegular:function(event){

    scenic.where({
      type: "网红打卡"

    }).get({
      success(res) {
         
        console.log(res)
        
        
        var type = res.data[0].type
        wx.navigateTo({
          //title: "goback",
          url: '../scenic/scenic?type=' + type,
        })

        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条

      }
    })
  },
  bindNature:function (event) {

    scenic.where({
      type: "自然风光"

    }).get({
      success(res) {

        console.log(res)


        var type = res.data[0].type
        wx.navigateTo({
          //title: "goback",
          url: '../scenic/scenic?type=' + type,
        })

        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条

      }
    })
  }
  

})