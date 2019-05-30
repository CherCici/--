// miniprogram/pages/scenic.js
//初始化云数据库
const db = wx.cloud.database({});
const scenic = db.collection('s_classify');

var app = getApp();
var searchValue = ''
var typeInderx = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始化数据集合存放数据库数据，用于前端展示
    page: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //定义变量存储数据

    var type = options.type;
    this.setData({
      typeInderx: type

    })
    var this_data = this;
    var scenic_list1 = ""
    scenic_list1 = wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: "s_classify",
        pagaIndex: 1,
        pageSize: 20,
        filter: { type: type }

      }

    }).then(res => {


      this.setData({
        scenic_list: res.result.data
      })

    })
    /*
       //通过连接云数据库（S_classify为后台数据名称），调用数据
      var this_data = this;
      db.collection('s_classify').get({
        success(res) {
          /***
           * 将获取的res.data数据存放在scenic_list数组中，scenic_list为页面data里初始化的集合用于存放数据的。
           */
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    /*this_data.setData({
      scenic_list: res.data
    })

},
 
})*/


  },
  inputbind: function (e) {

    this.setData({
      searchValue: e.detail.value
    })
  },
  inputbind: function (e) {
    this.setData({
      searchValue: e.detail.value

    })

  },
  bindsearch: function () {
    var searchValue = this.data.searchValue
    var that = this
    var gl = that.data.gl
    if (!searchValue) {
      wx.showToast({
        title: '请输入搜索内容',
      })
      return false
    } else {

      that.titleselect()
      return true
    }



  },
  //主题查找
  titleselect: function () {
    var searchValue = this.data.searchValue
    var that = this
    var scenic_list = that.data.scenic_list
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: "s_classify",
        pagaIndex: 1,
        pageSize: 10,
        filter: {
          s_name: searchValue
        }

      }
    })
      .then(res => {

        that.setData({
          scenic_list: res.result.data

        })
      })
  },
  //使用云函数获取删选数据
  getData: function (e) {

  },
  /* goOrder(event){
   var scenicId = event.currentTarget.dataset._id
     wx.navigateTo({
       title:"goback",
       url: '../order/order?id=' + scenicId ,
     })  
     },*/
  goOrder: function (e) {
    console.log(e)
    var scenicId = e.currentTarget.dataset._id
    wx.navigateTo({
      //title: "goback",
      url: '../scenic/scenic-detail/scenic-detail?id=' + scenicId,

    })
  },
  //上拉刷新
  onPullDownRefresh: function () {

    scenic.get({
      success(res) {

        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        this.setData({
          scenic_list: res.data
        }, res => {
          console.log("刷新完成")
          wx.stopPullDownRefresh()
        })

      }
    })


  },
  //下拉加载
  onReachBottom: function () {

    console.log("到底啦。。。")
    let page = this.data.page + 20;
    if (typeInderx == "") {
      scenic.skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.scenic_list
        this.setData({
          scenic_list: old_data.concat(new_data)
        }, res => {
          console.log("数据加载完成")
          wx.stopPullDownRefresh()
        })

      })

    } else {
      scenic_list1.skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.scenic_list
        this.setData({
          scenic_list: old_data.concat(new_data)
        }, res => {
          console.log("数据加载完成")
          wx.stopPullDownRefresh()
        })

      })
    }

  }

})