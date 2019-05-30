// pages/order/order-detail/order-detail.js


//初始化云数据库
const db = wx.cloud.database({});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scenic_list: [],
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    showModal: true,
    count: '',
    todayIndex: '',
    //数量
    num: 1,
    min: 'disabled',
    price: '',
    username: "",
    tel: ''
  },


  dateSelectAction: function (e) {
    var cur_day = e.currentTarget.dataset.idx;
    this.setData({
      todayIndex: cur_day,
      showModal: true
    })

  },

  setNowDate: function () {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const todayIndex = date.getDate() - 1;
    console.log(`日期：${todayIndex}`)
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch,
      todayIndex,
    })
  },

  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
  /** 
   * 隐藏模态对话框 
   */
  hideModal() {
    var that = this;
    that.setData({
      showModal: true,
    })
  },
  showModalBtn() {
    var that = this;

    that.setData({
      //showModal:false?true:false
      showModal: false
    })
  },
  /*日期选折器结束 **/
  //点击减号数量减1
  bindmin: function () {
    var num = this.data.num;
    if (num > 1) {
      num--;
    }
    var min = num <= 1 ? 'disabled' : 'normal';
    //将返回值与状态写回
    let scenic_list = this.data.scenic_list;

    let i = 0; //将返回值与状态写回
    this.setData({
      num: num,
      min: min,
      count: num * scenic_list[i].price
    });
  },
  //输入事件框
  bindMan: function () {
    var num = e.detail.value;
    this.setData({
      num: num
    });

  },
  //点击加号数量加1
  bindmax: function () {
    var num = this.data.num;
    num++;
    var min = num <= 1 ? 'disabled' : 'normal';
    let scenic_list = this.data.scenic_list;

    let i = 0; //将返回值与状态写回
    this.setData({
      num: num,
      min: min,
      count: num * scenic_list[i].price
    });

  },
  //计算价格
  bindcount: function (e) {
    var count = e.detail.value;
    this.setData({
      count: count
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setNowDate();
    var id = options.id;
    let i = 0;

    //通过连接云数据库（S_classify为后台数据名称），调用数据
    var this_data = this;
    db.collection('s_classify').where({
      _id: id
    }).get({
      success(res) {

        this_data.setData({
          scenic_list: res.data,
          count: res.data[i].price

          //price:res.data.items
        })


      },


    })

  },
  //点击按钮提交订单
  submitOrder: function (e) {
    const db = wx.cloud.database()
    var now = new Date();
    let tel = this.data.tel;

    if (this.data.cur_year < now.getFullYear()) {
      wx.showToast({
        title: '当前日期不能选折',
        icon: 'fail',
        duration: 1500,
        mask: true
      })
      return false
    } else if (this.data.cur_month < now.getMonth()) {
      wx.showToast({
        title: '当前日期不能选折',

        duration: 1500,
        mask: true
      })
      return false

    } else if (this.data.todayIndex < now.getDate() - 1) {
      wx.showToast({
        title: '当前日期不能选折',

        duration: 1500,
        mask: true
      })
      return false

    } else if (this.data.username == '') {
      wx.showToast({
        title: '请输入用户名',

        duration: 1000,
        mask: true
      })

      return false
    } else if (this.data.tel == '') {
      wx.showToast({
        title: '手机号不能为空',

      })

      return false
    } else if (tel.length != 11) {
      wx.showToast({
        title: '手机号不正确',

        duration: 1500

      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(tel)) {
      wx.showToast({
        title: '手机号有误！',

        duration: 1500
      })
      return false;
    }
    this.add()
    return true;



  },
  /**点击按钮提交订单结束**/

  /**数据提交到数据库函数**/
  add: function () {
    let scenic_list = this.data.scenic_list;
    //let amount=this.data.num;
    let cur_month = this.data.cur_month;
    let cur_year = this.data.cur_year;
    let todayIndex = this.data.todayIndex + 1
    db.collection("order").add({
      data: {
        scenicid: scenic_list[0]._id,
        price: scenic_list[0].price,
        name: scenic_list[0].s_name,
        o_image: scenic_list[0].image,
        amount: this.data.num,
        totalprice: this.data.count,
        userdate: cur_year + "/" + cur_month + "/" + todayIndex,
        username: this.data.username,
        tel: this.data.tel,
        state: false,
        scann: false

      },
      success: res => {
        wx.showToast({
          title: '购票成功',
          duration: 3000
        })
        wx.switchTab({
          url: '../../../pages/orderrr/order/order',
        })
      },
      fail: err => {
        wx.showToast({
          title: '购票失败',
        })
      }
    })
  },
  changeName: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  changeTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },

})