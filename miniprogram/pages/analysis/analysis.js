
// pages/index/lookrecord/lookrecord.js
const db = wx.cloud.database()
var wxCharts = require('../../utils/wxcharts.js');  //引入wxChart文件

var app = getApp();

var lineChart = null;
const mon = app.globalData.mon
var month = app.globalData.month
var day = app.globalData.day
import Notify from '../../components/dist/notify/notify'
Page({

  /**

  * 页面的初始数据

  */

  data: {
 
    mon:mon,
    month:month,
    head0: 'head_item head_itemActive',
    head1: 'head_item',
    currentData: 0,
    selectPerson: true,
    active: 1,
    week:[],
    monMean:0,
    getArray:[],
    sevenData:{},
    weekPrice:[],
    dayMean:0,
    weekSum:0,
    monData:{},
    categoryPrice:{
      '淘宝':0,
      '饮食':0,
      '娱乐':0,
      '其他':0
    }
  },

  share(){
    Notify({
      type: 'warning',
      message: '收藏分享 暂未投入使用',
      //color: 'black',
      //background: 'red',
      duration: 3000,
    });
  },

  look(){
    Notify({
      type: 'warning',
      message: '查看详情 暂未投入使用',
      //color: 'black',
      //background: 'red',
      duration: 1000,
    });
  },
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;

    if (that.data.currentData === parseInt(e.target.dataset.current)) {
      return false;
    } else {
      this.createPieCharts()
      this.createLineCharts()
      that.setData({
        ['head' + that.data.currentData]: 'head_item',
        ['head' + parseInt(e.target.dataset.current)]: 'head_item head_itemActive',
        
        currentData: parseInt(e.target.dataset.current)
      })
    }
  },


  getSevenDay(){
    var myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getDate() - 7);
    var dateArray = [];
    var getArray = [];
    var dateTemp;
    var flag = 1;
    var day = 0;
    for (var i = 0; i < 7; i++) {
      if (myDate.getDate()<'10'){
        day = '0'+myDate.getDate()
      }
      else{
        day = myDate.getDate()
      }
      dateTemp = mon[myDate.getMonth()] + "-" + day;
      getArray.push(mon[myDate.getMonth()] +  day)
      dateArray.push(dateTemp);
      myDate.setDate(myDate.getDate() + flag);
    }
    this.setData({
      week:dateArray,
      getArray:getArray
    })
  },
  torecord() {
  
    // wx.navigateTo({

    //  url: '../lookrecord/lookrecord',

    // })

    wx.navigateBack({

      delta: 1,

    })

  },

  touchHandler: function (e) {

    lineChart.showToolTip(e, {

      // background: '#7cb5ec',

      format: function (item, category) {

        return category + ' ' + item.name + ':' + item.data

      }

    });

  },

  // createSimulationData: function () {

  //  var categories = [];

  //  var data = [];

  //  for (var i = 6; i > 0; i--) {

  //    categories.unshift('2018-' + (i + 1));

  //    data.push(Math.random() * (20 - 10) + 10);

  //  }

  //  // data[4] = null;

  //  return {

  //    categories: categories,

  //    data: data

  //  }

  // },

  updateData: function (e) {

    // var simulationData = this.createSimulationData();

    // var series = [{

    //  name: '成交量1',

    //  data: simulationData.data,

    //  format: function (val, name) {

    //    return val.toFixed(2) + '万';

    //  }

    // }];

    // lineChart.updateData({

    //  categories: simulationData.categories,

    //  series: series

    // });

  },

  /**

  * 生命周期函数--监听页面加载

  */
  getMonData(event){
    return new Promise(resolve => {
      console.log("getMon")
      db.collection(mon[event - 1]).where({
        _openid: app.globalData.openid  //进行筛选
      }).get({
        success: res => {
          var sevenData = this.data.sevenData
          console.log(res.data[0])
          for (let i in res.data[0]) {
            //console.log(i)
            if (this.data.getArray.includes(i)) {
              // console.log(i)
              sevenData[[i]] = res.data[0][i]
            }

          }

          this.setData({
            sevenData: sevenData,
            monData: res.data[0],
            monPrice: res.data[0]['monPrice'].toFixed(2)
          })

          return resolve()

        }
      })
    })
    
  },
//没有考虑1月前七天
  calculatePrices(){
    var categoryPrice = this.data.categoryPrice
    for(var i in this.data.monData){
     // console.log(l
      if (typeof (this.data.monData[i]) != 'object'){}
      else{
        var l = Object.keys(this.data.monData[i]).length
        if (l > 1) {
          for (var j in this.data.monData[i]) {
            //console.log(categoryPrice[this.data.monData[i][j]['categroy']])
            categoryPrice[this.data.monData[i][j]['categroy']] += (this.data.monData[i][j]['price'])
            //console.log(categoryPrice)
          }
        }
      }
      
      /*
      
      }*/
    }
    this.setData({
      categoryPrice:categoryPrice
    })
  },

  getWeekPrice(){
    return new Promise(resolve => {
      var weekPrice = []
      for (let i in this.data.getArray) {
        weekPrice.push(this.data.sevenData[this.data.getArray[i]]['dayPrice'])
        // console.log(this.data.getArray[i])
      }
      var sum = 0
      for(var i in weekPrice){
        sum += weekPrice[i]
      }
      var dayMean = (sum/weekPrice.length).toFixed(2)
      this.setData({
        weekPrice: weekPrice,
        dayMean:dayMean,
        weekSum:sum.toFixed(2)
      })
      return resolve()
    })
    
  },

  createLineCharts(){
    var windowWidth = '', windowHeight = '';    //定义宽高

    try {

      var res = wx.getSystemInfoSync();    //试图获取屏幕宽高数据

      windowWidth = res.windowWidth / 750 * 690;  //以设计图750为主进行比例算换

      windowHeight = res.windowWidth / 750 * 550    //以设计图750为主进行比例算换

    } catch (e) {

      console.error('getSystemInfoSync failed!');  //如果获取失败

    }

    lineChart = new wxCharts({    //定义一个wxCharts图表实例

      canvasId: 'lineCanvas',    //输入wxml中canvas的id

      type: 'line',      //图标展示的类型有:'line','pie','column','area','ring','radar'

      categories: this.data.week,    //模拟的x轴横坐标参数

      animation: true,  //是否开启动画

      series: [{  //具体坐标数据

        name: '日总价',  //名字

        data: this.data.weekPrice,  //数据点

        format: function (val, name) {  //点击显示的数据注释

          return val + '元';

        }

      },

      ],

      xAxis: {  //是否隐藏x轴分割线

        disableGrid: true,

      },

      yAxis: {      //y轴数据

        title: '价格',  //标题

        format: function (val) {  //返回数值

          return val.toFixed(2);

        },

        min: 0,  //最小值

        max: Math.max(...this.data.weekPrice),  //最大值

        gridColor: '#D8D8D8',

      },

      width: windowWidth,  //图表展示内容宽度

      height: windowHeight,  //图表展示内容高度

      dataLabel: false,  //是否在图表上直接显示数据

      dataPointShape: true, //是否在图标上显示数据点标志

      extra: {

        lineStyle: 'curve'  //曲线

      },

    });
  },




  createPieCharts(){
    var windowWidth = '', windowHeight = '';    //定义宽高

    try {

      var res = wx.getSystemInfoSync();    //试图获取屏幕宽高数据

      windowWidth = res.windowWidth / 750 * 690;  //以设计图750为主进行比例算换

      windowHeight = res.windowWidth / 750 * 550    //以设计图750为主进行比例算换

    } catch (e) {

      console.error('getSystemInfoSync failed!');  //如果获取失败

    }

    lineChart = new wxCharts({    //定义一个wxCharts图表实例

      animation: true, //是否有动画
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '饮食',
        data: this.data.categoryPrice['饮食'],
      }, {
        name: '淘宝',
        data: this.data.categoryPrice['淘宝'],
      }, {
        name: '娱乐',
        data: this.data.categoryPrice['娱乐'],
      },{
        name: '其他',
        data: this.data.categoryPrice['其他'],
      }],
      
      width: windowWidth,
      height: 240,
      dataLabel: true,

    });
  },


  onLoad: function (e) {
    this.getSevenDay()
    if(day<'07'){// 解决一月前七天问题
      this.getMonData(month-1).then(result =>{
        this.getMonData(month).then(result =>{
          //var monMean = (this.data.monData['monPrice']/parseInt(day)).toFixed(2)
          this.setData({
            monMean: (this.data.monData['monPrice'] / parseInt(day)).toFixed(2)
          })
         // console.log(monMean)
          this.calculatePrices()
          this.getWeekPrice().then(result =>{
            this.createLineCharts()
          })
        })
      })
    }
    else{
      this.getMonData(month).then(result => {
       // var monMean = (this.data.monData['monPrice'] / parseInt(day)).toFixed(2)
        this.setData({
          monMean: (this.data.monData['monPrice'] / parseInt(day)).toFixed(2)
        })
       // console.log(monMean)
        this.calculatePrices()
        this.getWeekPrice().then(result =>{
          this.createLineCharts()
        })
      })
    }

    
  },

  /**

  * 生命周期函数--监听页面初次渲染完成

  */

  onReady: function () {

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

  },

})
