// miniprogram/pagesroder/pages/gonglv/gonglv/gonglv.js
const db = wx.cloud.database({});
const dbdiscuss = db.collection('s_discuss');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //评论内容
    text: '',
    //攻略图片
    imgUrl: '',
    address:'',
    cityName:"上海市",
    textTitle:'',
    count: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //跳转到选折城市页面
  cityChoose: function (e) {
    wx.navigateTo({
      url: '../../../../pages/cityChoose/city',
    })
  },
  change: function (cityName) {
    
    this.setData({
      cityName: cityName
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userOpenId = this.data.openid
    console.log(userOpenId)
    if (userOpenId) {
      wx.showToast({
        title: '您还未登录,请先登录~',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({

          url: '../../../pages/own/owm',
        })
      }, 1500)
    } else {
      console.log(userOpenId)
    }

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
  getCount: function () {
    //已输入的字数 
    var that = this
    db.collection('gonglv').count({
      success: res => {
        that.setData({
          count: Number(res.total) + 1
        })
      }
    })
  },
  textInput: function (e) {
    this.setData({
      text: e.detail.value
    })
  },
  textInputTitle: function (e) {
    this.setData({
      textTitle: e.detail.value
    })
  },
  pulish: function () {
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
            
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,

              })
              var city = this.data.cityName
              console.log(city)
              var data = {
                image: new Array(app.globalData.fileID),
                //将图片储存为数组类型 
                title:this.data.textTitle,
                content: this.data.text, //用户输入的文字 
                username: res.userInfo.nickName, //用户名
                avatarUrl: res.userInfo.avatarUrl,
                id: Number(this.data.count) + 1,
                city: city,
                shareNum: 0,
                commentNum: 0,
                validStatus: 0,
                validTime: 0,
               

              }
              if (data.content) {
                db.collection('gonglv').add({
                  data: data,
                  success: res => {
                    this.updateorder()
                    wx.showToast({
                      title: '发布成功',
                    })
                    setTimeout(() => {
                      wx.switchTab({
                        url: '../../../pages/gl/gl',
                      })

                    }, 1000)
                  },
                  fail: e => {
                    wx.showToast({
                      title: '发布错误',
                    })
                    console.log(e)
                  }
                })
              } else {
                wx.showToast({
                  title: '请填写文字',
                  icon: 'none'
                })
              }
              /***user.add({
                data: {
                  avatarUrl: res.userInfo.avatarUrl,
                  userName: res.userInfo.nickName,
                  city: res.userInfo.City,
                  country: res.userInfo.country
                }
              })**/
            }

          })
        }
      }
    })

  },
 
  // 上传图片
  doUpload: function () {
    // 选择图片
    var that = this
    wx.chooseImage({
      count: "",
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        that.setData({
          imgUrl: filePath
        })

        // 上传图片
        const cloudPath = that.data.count + filePath.match(/\.[^.]+?$/)[0]
        //改写 多图片数组
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath


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

  //跳转到城市选折页面
  chonsecity:function(){
    wx.navigateTo({
      url: '../../../../pages/cityChoose/city',
    })

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

  }
})