//app.js/*
/*
*/

var timestamp = Date.parse(new Date()),
date = new Date(timestamp),
//获取年份  
year = date.getFullYear(),
//获取月份  
month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
//获取当日日期 
day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
App({

  globalData:{
    mon :['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNum : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    //获取年份  
    year : year,
    //获取月份  
    month : month,
    //获取当日日期 
    day : day,
  },

  onLaunch: function () {
    var that = this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log("云函数 [login] user openid: ", res.result.openid)
          that.globalData.openid = res.result.openid;
        },
        fail: res => {
          console.log("云函数 [login] 调用失败")
        }
      })
    }
   
  }
  
})
