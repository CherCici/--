//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {}
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
    
    getUserInfo:function(cb){
      var that=this
      if(this.globalData.userInfo){
        typeof cb=="function" && cb(this.globalData.userInfo)
      }
      else{
        wx.login({
          success:function(){
            wx.getUserInfo({
              success:function(res){
                that.globalData.userInfo=res.userInfo
                typeof cb== "function" && cb(that.globalData.userInfo)

              }
            })
          }
        })
      }
    },
    globalData:{
      userInfo:null
    }
  

})
