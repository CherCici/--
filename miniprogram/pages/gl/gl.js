// pages/gl/gl.js
const db = wx.cloud.database({});
const scenic = db.collection('s_classify');

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gl: [],
    cityName: "上海市",
    searchValue: ""
  },
  onLoad: function() {
    var that = this
    var gl = that.data.gl
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: 'gonglv',
        pagaIndex: 1,
        pageSize: 10
      }
    }).then(res => {
      console.log(res)
      that.setData({
        gl: res.result.data
      })
    })

  },
  //跳转到选折城市页面
  cityChoose: function(e) {
    wx.navigateTo({
      url: '../../../../cityChoose/city',
    })

    var city = this.data.cityName
    db.collection('gonglv').where({
        city: city
      }).get()

      .then(res => {
        console.log(res)
        this.setData({
          gl: res.data,

        })
      })
  },
  citychange: function(cityName) {

    this.setData({
      cityName: cityName
    })



  },

  getData: function() {
    var that = this
    var gl = that.data.gl
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: 'gonglv',
        pagaIndex: 1,
        pageSize: 10
      }
    }).then(res => {
      console.log(res)
      this.setdata({
        gl: res.data
      })
    })
  },
  godetail: function(e) {
    var id = e.currentTarget.dataset._id
    wx.navigateTo({
      //title: "goback",
      url: '../../pagesroder/pages/gonglv/gonglv-detail/gonglv-detail?id=' + id,

    })
  },

  onShow: function() {
    var city = this.data.cityName
    db.collection('gonglv').where({
        city: city
      }).get()

      .then(res => {
        console.log(res)
        this.setData({
          gl: res.data,

        })
      })
  },
  inputbind: function(e) {
    this.setData({
      searchValue: e.detail.value

    })

  },
  bindsearch: function() {

    var searchValue = this.data.searchValue
    var search = this.titleselect()
    var that = this
    var gl = that.data.gl
    if (!searchValue) {
      wx.showToast({
        title: '请输入搜索内容',
      })
      return false
    } else  {

      that.titleselect()
      return true
    } 
  
  

},
//主题查找
titleselect: function() {
  var searchValue = this.data.searchValue
  var that = this
  var gl = that.data.gl
  wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: 'gonglv',
        pagaIndex: 1,
        pageSize: 10,
        filter: {
          title: searchValue
        }

      }
    })
    .then(res => {
      console.log(res)
      that.setData({
        gl: res.result.data
        
      })
    })

},
//城市查找
cityselect: function() {
  var searchValue = this.data.searchValue
  var that = this
  var gl = that.data.gl
  wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: 'gonglv',
        pagaIndex: 1,
        pageSize: 10,
        filter: {
        city: searchValue
        }

      }
    }).get({

    })
    .then(res => {
      console.log(res)
      that.setData({
        gl: res.result.data
      })
    })

}
})