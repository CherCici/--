// miniprogram/pagesroder/pages/discuss/discuss-list/discuss-list.js
const db = wx.cloud.database({});
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    order:[],
    scenic_list:[]


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
   this.findInfo()
  },
  //查找用户信息和评价信息
  findInfo: function () {
    // this.initData()

    var i = 0
    let scenic_list = this.data.scenic_list
    var order = this.data.order
    //var scenic=this.data.scenic
    var that_data = this
    db.collection('s_discuss').get()
      .then(res => {
        console.log(res.data)
        // success(res) {
        //for (i = 0; i <res.data.length; i++) {
        that_data.setData({
          order: res.data
          //  scenic:order.concat(that_data.data.order)
          // scenicid: res.data[i].scenicid

        })

        //  }

        // } 
        res.data.forEach(function (items, index) {

          //var scenic=order.scenic
          // for (i = 0; i < items.length; i++) {
          db.collection('user').where({
            openid: items.openid
          }).get({

            success(res) {
              // console.log(res.data)
              that_data.setData({
                scenic_list: res.data.concat(that_data.data.scenic_list)


              })
              // 




              //console.log(scenic)
            },

          })



          // }
        })

        
        /// console.log(this.scenic())
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

  }
})