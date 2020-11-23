
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
var mon = app.globalData.mon
var year = app.globalData.year
var month = app.globalData.month
var day = app.globalData.day
var dayNum = app.globalData.dayNum
var myDate = new Date()
var time = myDate.toLocaleTimeString()
import Dialog from '../../components/dist/dialog/dialog'
import Notify from '../../components/dist/notify/notify'

Page({
  data: {
    img: {
      '饮食': 'cloud://bookkeeping-ywonchall.626f-bookkeeping-ywonchall-1303847606/icon/饮食.png',
      '淘宝': 'cloud://bookkeeping-ywonchall.626f-bookkeeping-ywonchall-1303847606/icon/淘宝.png',
      '娱乐': 'cloud://bookkeeping-ywonchall.626f-bookkeeping-ywonchall-1303847606/icon/娱乐.png',
      '其他': 'cloud://bookkeeping-ywonchall.626f-bookkeeping-ywonchall-1303847606/icon/其他.png'
    },
    categroy: [
      { text: '饮食', value: 0 },
      { text: '淘宝', value: 1 },
      { text: '娱乐', value: 2 },
      { text: '其他', value: 3 },
    ],
    categroyIndex: 0,
    name:'',
    price:'',
    openid:'',
    today:{},
    goodsName:'',
    goodsPrice:'',
    monPrice:'',
    dayPrice:0,
    payment:[
      { text: '微信', value: 0 },
      { text: '支付宝', value: 1 },
      { text: '银行卡', value: 2 },
      { text: '校园卡', value: 3 },
    ],
    paymentIndex:0
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },
  onClose() {
    this.setData({ show: false });
  },
  /*
  onChose(event) {
    this.setData({
      radio: event.detail,
    });
  },*/
  deleteData(event){
    var dayPrice = this.data.today[event.target.dataset.id]['price']
    //delete this.data.today[event.target.dataset.id]
    this.setData({
      dayPrice: parseFloat((this.data.dayPrice - this.data.today[event.target.dataset.id]['price']).toFixed(2)),
      monPrice: parseFloat((this.data.monPrice - this.data.today[event.target.dataset.id]['price']).toFixed(2)),
    })

    var dayBook = this.data.today
    delete dayBook[event.target.dataset.id]
    console.log(dayBook)
    dayBook['dayPrice'] = this.data.dayPrice
    
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        collect: mon[month - 1],
        openid: this.data.openid,
        data: [mon[month - 1] + day]
          //Oct01:123// 获取到当天数据 从更新当天数据开始
        },
      success: res => {
        console.log("delete success1")
        //console.log(dayBook)
        this.updata(dayBook).then(result => {
          delete dayBook['dayPrice']
          console.log("delete success2")
          this.setData({
            today: dayBook
          })
        })
        
      },
      fail: res => {
        console.log("调用失败", res)
      }
    })
    
    //console.log(this.data.today[event.target.dataset.id])
  },
  // 类型切换
  clear(){
    this.setData({
      goodsName: '',
      goodsPrice: '',
      name: '',
      price: ''
    })
  },
  updata(event){
    return new Promise(resolve => {
      console.log(mon[month - 1]+day)
      console.log(event)
      wx.cloud.callFunction({
        name: 'update',
        data: {
          collect: mon[month - 1],
          openid: this.data.openid,
          data: {
            [mon[month - 1] + day]: event,
            monPrice: this.data.monPrice
            //Oct01:123// 获取到当天数据 从更新当天数据开始
          }
        },
        success: res => {
          //this.onShow()
          console.log("updata success")
          delete event['dayPrice']
        // this.setData({
        //   today: event
        // })
          this.setData({
            today: event, 
            goodsName:'',
            goodsPrice:'',
            name:'',
            price:'',
          });
          Notify({
            type:'success',
            message: '操作成功',
            //color: 'black',
            //background: 'red',
            duration: 1000,
          });

          console.log(res.result)//清除输入框
          return resolve()
        },
        fail: res => {
          console.log("调用失败", res)
        }
      })
    })
  },
  switchValue1(event){
    this.setData({
      categroyIndex:event.detail
    })

  },
  switchValue2(event) {
    this.setData({
      paymentIndex: event.detail
    })

  },
  // 名称脱焦
  nameBlur(event) {
    this.setData({
      name: event.detail.value
    })
  },
// 价格内容改变
  onChange(event) {
    this.setData({
      price: parseFloat(parseFloat(event.detail).toFixed(2))
    })
  },
  onShow(){

  },
  // 保存提交
  post(){
    // 判断是否为空
    if(this.data.name&&this.data.price){
    }
    else{
      Dialog.alert({
        message: '请输入正确的名称和价格',
      }).then(() => {
        // on close
      });
      return null
    }
    // daybook 今天已购账单
    var dayBook = this.data.today
    
    // todayBook 当前账单
    var todayBook = {}
    todayBook['time'] = time
    todayBook['categroy'] = this.data.categroy[this.data.categroyIndex].text
    todayBook['name'] = this.data.name
    todayBook['price'] = this.data.price
    todayBook['payment'] = this.data.payment[this.data.paymentIndex].text
    console.log(typeof(this.data.price))
    //todayBook['dayPrice'] = todayBook['dayPrice'] + this.data.price
    var id = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
    dayBook[[id]] = todayBook
    dayBook['dayPrice'] = parseFloat((this.data.dayPrice + this.data.price).toFixed(2))
    this.setData({
      dayPrice: dayBook['dayPrice'],
      monPrice: parseFloat((this.data.monPrice + this.data.price).toFixed(2))
    })
    console.log(dayBook)
    this.updata(dayBook)
    
  },


  
  onLoad: function() {
    
    var date = mon[month - 1] + day
    this.setData({
      openid: app.globalData.openid
    })
    wx.cloud.callFunction({
      name: 'get',
      data: {
        collect: mon[month-1],
        openid: this.data.openid
      },
      success: res => {
        console.log(res.result.data[0])
        this.setData({
          dayPrice: res.result.data[0][date]['dayPrice'],
          monPrice: res.result.data[0]['monPrice'],
          
        })

        delete res.result.data[0][date]['dayPrice']
        //console.log(tmpToday)
        this.setData({
          today: res.result.data[0][date]
        })
        //var l = Object.keys(res.result.data[0][date]).length
       // var todayList = []
      },
      fail: res => {
        console.log("调用失败", res)
      }
    })
  }
})
