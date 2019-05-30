//初始化云数据库
const db = wx.cloud.database({});
const discuss = db.collection('s_discuss');
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    scenic_list: [],
    discuss: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //定义变量存储数据
    var id = options.id;
    // console.log(id)
    // var this_data = this;
    var discuss = this.data.discuss
    db.collection('s_discuss').where({ scenicid: id }).get()
      .then(res => {


        // console.log(res)
        this.setData({
          discuss: res.data

        })

      })
    console.log(discuss)
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: "s_classify",
        pagaIndex: 2,
        pageSize: 20,
        filter: { _id: id }

      }


    }).then(res => {


      this.setData({
        scenic_list: res.result.data
      })

    })


  },
  onShow: function () {

  },
  submitOrder: function (e) {
    console.log(e)
    var scenicid = e.currentTarget.dataset._id
    wx.navigateTo({
      //title: "goback",
      url: '../../../pagesroder/pages/order/order?id=' + scenicid,
    })
  },


})