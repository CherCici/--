// pages/own/owm.js
//index.js
const app = getApp()
const db = wx.cloud.database({});
const user = db.collection('user');

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    discuss:[],
    user:[],
    currtab: 0,
    swerptab: [{
      name: '基本信息',
      index: 0
    }, {
      name: '我的评价',
      index: 1
    }, {
      name: '我的攻略',
      index: 2
    }],
  },
  onReady: function() {
    //页面渲染
    this.getDeviceInfo()
    this.informationShow()

  },
  getDeviceInfo: function() {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        deviceW: res.windowWidth;
        deviceH: res.windowHeight
      },
    })

  },
  tabSwich: function(e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }

  },
  tabchange: function(e) {
    this.setData({
      currtab: e.detail.current
    })
    this.informationShow()

  },
  //
  informationShow: function() {
    let that = this
    switch (this.data.currtab) {
      case 0:
        that.discussco()
        // that.findScenic()
        break
      case 1:
        that.gonglue() 

        break
      case 2:
        that.information();
        break

    }
  },
  information: function() {
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: "user",

        filter: { _openid: this.data.openid }

      }

    }).then(res => {


      this.setData({
        user: res.result.data
      })

    })

  },
  discussco: function() {
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: "s_discuss",
        pagaIndex: 1,
        pageSize: 20,
        filter: { _openid: this.data.openid }

      }

    }).then(res => {


      this.setData({
        discuss: res.result.data
      })

    })

  },
  gonglue: function() {

  },
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                
              })
              
             /*** user.add({
                data:{
                  avatarUrl: res.userInfo.avatarUrl,
                  userName: res.userInfo.nickName,
                  city: res.userInfo.City,
                  country:res.userInfo.country
                }
              })**/
            }

          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  //插入用户信息
  insent: function() {
    user.add({
      data:{

      }
    })

  },
  gonglv:function(){
    wx.navigateTo({
      url: '../../pagesroder/pages/gonglv/gonglv/gonglv',
    })
  }
  
})