// pages/order/order.js

const db = wx.cloud.database({});
const scenic = db.collection('s_classify');
var app = getApp();
//const order = db.collection('order');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currtab: 0,
    swerptab: [{
      name: '待使用',
      index: 0
    }, {
      name: '已完成',
      index: 1
    }, {
      name: '待评价',
      index: 2
    }, {
      name: '已取消',
      index: 3
    }, ],
    order: [],
    scenic: [],
    scenic_list: [],
    finnishorder: [],
    discuss: [],
    idd:[]


  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   var id=options.id
    
  
  },
  //点击进入扫码入园页面
  code: function(e) {
    
    var order = e.currentTarget.dataset._id
    console.log(order)
    wx.navigateTo({
      //title: "goback",
      url: '../../../pagesroder/pages/order-detail/order-datail?id' + order,
    })
  },
  //点击跳转评论页面
  waitdiscuss:function(e){
    var order = e.currentTarget.dataset._id
    
    db.collection('order').where({
      _id: order
    }).get()
      .then(res => {
        //success(res) {
       // console.log(res.result.data.scenicid)
        this.setData({
          idd: res.data[0].scenicid
        })
        var idd = this.data.idd
        wx.navigateTo({
          //title: "goback",
          url: '../../../pagesroder/pages/discuss/discussco?id=' + order + '&idd=' + idd,
        })
        // },
        //console.log(idd)    
      })
   
   

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //页面渲染
    this.getDeviceInfo()
    this.orderShow()

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
    this.orderShow()

  },
  //订单显示
  orderShow: function() {
    let that = this
    switch (this.data.currtab) {
      case 0:
        that.wait();
        // that.findScenic()
        break
      case 1:
        that.already()
        break
      case 2:
        that.discussco()
        break
      case 3:
        that.cancall()
        break
    }
  },
  /*** already: function () {
     var finnishorder=this.data.finnishorder
     db.collection('order').where({
       openid: this.data.openid,
       state: true

     }).get()
     .then(res =>{
       //success(res) {
         this.setData({
           finnishorder: res.data
         })
      // },
       
     })
     console.log(finnishorder)
     this.findscenic()
   },
   wait: function () {
     // this.initData()

     var i = 0
     let scenic_list = this.data.scenic_list
     var order = this.data.order
     //var scenic=this.data.scenic
     var that_data = this
     db.collection('order').where({
       openid: this.data.openid,
       state: false
     }).get()
       .then(res => {
         //console.log(res.data)
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
           db.collection('s_classify').where({
             scenicid: items.scenicid
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

         this.scenic()
         /// console.log(this.scenic())
       })

   },**/
  findscenic: function() {
    let order = this.data.order
    db.collection('classify').where({
      scenicid: this.data.order.scenicid
    }).get({
      success(res) {
        console.log(res.data)
        that_data.setData({
          scenic_list: res.data
        })
        // 




        //console.log(scenic)
      },

    })
  },
  scenic: function() {
    var scenic_list = this.data.scenic_list
    var order = this.data.order
    var scenic = scenic_list.concat(order)
    var lengtha = this.data.lengtha
    let i = 0
    console.log(scenic)

    /** for(i=0;i<order.length;i++){
       scenic[i].push(scenic_list[i], order[i]);
       console.log(scenic_list[i] || order[i])
     }*/
    this.setData({
      scenic: scenic,
      lengtha: scenic.length

    })
    lengtha = scenic.length
    console.log(lengtha)
  },
  //待评价内容显示
  discussco: function () {
    var discuss = this.data.discuss
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: "order",

        pageSize: 20,
        filter: {
          openid: this.data.openid,
          scann: true,
          state: false
      
        }
      }

    }).then(res => {
      console.log(res)
      this.setData({
        discuss: res.result.data
      })

    })
  },
  /**遍历数组
  scenic: function (abj1, abj2) {
    var ab = []
    var ab2 = []
    var count1 = ab.length
    var count1 = ab.length
    Object.assign(ab[])

  },*/

  //待使用
  wait: function() {
    var order = this.data.order
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: "order",
        
        pageSize: 20,
        filter: {
          openid: this.data.openid,
          state: false,
          scann: false
        }
      }

    }).then(res => {
      
      this.setData({
        order: res.result.data
      })

    })
  },
  //已完成
  already: function() {
    var finnishorder = this.data.finnishorder
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: "order",
        
        pageSize: 20,
        filter: {
          openid: this.data.openid,
          state: true,
          scann: true
        }
      }

    }).then(res => {
      
      this.setData({
        finnishorder: res.result.data
      })

    })
  },
  //已取消
  cancall: function() {
    var finnishorder = this.data.finnishorder
    //var date=this.data.date
    wx.cloud.callFunction({
      name: 'sceniccloud',
      data: {
        dbname: "order",
        pagaIndex: "",
        pageSize: 20,
        filter: {
          openid: this.data.openid,
          state: true,
          scann: false
        }
      }

    }).then(res => {
      
      this.setData({
        scenic_list: res.result.data
      })

    })
  },
  cancal: function(e) {
    var id = e.currentTarget.dataset._id
    db.collection('order').doc(id).update({
        data: {
          state: true
        },
        success: res=>{
          //console.log(state)
          wx.showToast({
            title: '成功取消订单',
            duration: 3000

          })
          
          this.wait()
          },
        fail: res => {

          wx.showToast({
            title: '取消订单失败',
            icon:fail,
            duration: 3000

          })
        }
        
      })
},
  
//删除订单
  deleteorder:function(e){
    var id = e.currentTarget.dataset._id
    db.collection('order').doc(id).remove({
      success(res) {
        wx.showToast({
          title: '删除成功',
          duration: 3000
        })
        this.cancall()
      }
    })

  },

/**
 * 生命周期函数--监听页面显示
 */
onShow: function() {

},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function() {

},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function() {

},

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function() {

},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function() {

},

/**
 * 用户点击右上角分享
 */
onShareAppMessage: function() {

},

})