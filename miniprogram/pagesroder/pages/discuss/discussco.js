// miniprogram/pagesroder/pages/discuss/discuss.js
//const model = require('../../../pages/cityChoose/cityChoose.js')
////const config = require('../../utils/config.js')
//const util = require('../../utils/util.js')
const db = wx.cloud.database({});
const dbdiscuss = db.collection('s_discuss');
var app = getApp();
var mydata = {
  end: 0,
  replyUserName: ""
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    release: [],
    releaseFocus: true, //隐藏输入框
    releaseValue: '', //清空输入框内容
    text: '',
    imgUrl: '',
    count: 0,
    orderid: '',
    idd:"",
    userOpenId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //获取页面传过来的参数
    var orderid = options.id
    var idd = options.idd
    console.log(orderid)
   console.log(idd)
    var replyUserName = "";
    this.getCount()
    that.setData({
      orderid:orderid,
      idd:idd
    })
    //设置scroll的高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight,
          //userOpenId: res.openid,
          
        });
      }
    });

  },
  onShow: function() {
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
  getCount: function() {
    //已输入的字数 
    var that = this
    db.collection('s_discuss').count({
      success: res => {
        that.setData({
          count: Number(res.total) + 1
        })
      }
    })
  },
  textInput: function(e) {
    this.setData({
      text: e.detail.value
    })
  },
  pulish: function() {
    // 获取用户信息
    var orderid=this.data.orderid
    var idd=this.data.idd
    console.log(orderid,idd)
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
              var data = {
                image: new Array(app.globalData.fileID),
                //将图片储存为数组类型 
                content: this.data.text, //用户输入的文字 
                comment: [],
                orderid: orderid,
                scenicid: idd,
                username: res.userInfo.nickName, //用户名
                avatarUrl: res.userInfo.avatarUrl,
                id: Number(this.data.count) + 1,
                shareNum: 0,
                commentNum: 0,
                validStatus: 0,
                validTime: 0,

              }
              if (data.content) {
                db.collection('s_discuss').add({
                  data: data,
                  success: res => {
                    this.updateorder()
                    wx.showToast({
                      title: '发布成功',
                    })
                    setTimeout(() => {
                      wx.switchTab({
        
                         url: '../../../pages/orderrr/order/order',
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
  updateorder: function() {
    var id =  this.data.orderid
    db.collection('order').doc(id).update({
      data: {
        state: true
      },
      success: res => {
        //console.log(state)
        wx.showToast({
          title: '评论成功',
          duration: 3000

        })

        // this.wait()
      },
      fail: res => {

        wx.showToast({
          title: '',
          icon: fail,
          duration: 3000

        })
      }

    })

  },




  // 上传图片
  doUpload: function() {
    // 选择图片
    var that = this
    wx.chooseImage({
      count: "",
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

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

  submitForm(e) {
    var form = e.detail.value;
    var that = this;
    console.log(app.globalData.haulUserInfo);
    if (form.comment == "") {
      util.showLog('请输入评论');
      return;
    }
    // 提交评论
    dbdiscuss.add({
      data: {
        sourceId: mydata.sourceId,
        comment: form.comment,
        userId: app.globalData.haulUserInfo.id,
        userName: app.globalData.haulUserInfo.userName,
        replyCommentId: mydata.commentId,
        replyUserName: mydata.replyUserName,
        userPhoto: app.globalData.haulUserInfo.userPhoto
      },
    })
    wx.request({
      url: config.insertComment,
      method: "POST",
      data: {
        sourceId: mydata.sourceId,
        comment: form.comment,
        userId: app.globalData.haulUserInfo.id,
        userName: app.globalData.haulUserInfo.userName,
        replyCommentId: mydata.commentId,
        replyUserName: mydata.replyUserName,
        userPhoto: app.globalData.haulUserInfo.userPhoto
      },
      success: res => {
        console.log(res)
        if (res.data.success) {
          wx.showToast({
            title: "回复成功"
          })
          that.refresh();
          mydata.commentId = "";
          mydata.replyUserName = "";
          this.setData({
            replyUserName: mydata.replyUserName,
            reply: false
          })
        } else {
          wx.showToast({
            title: '回复失败，请检查您的网络',
          })
        }
      },

    })
  }
})