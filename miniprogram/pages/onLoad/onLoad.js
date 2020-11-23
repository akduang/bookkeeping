const app = getApp()
const db = wx.cloud.database()
var mon = app.globalData.mon
var year = app.globalData.year
var month = app.globalData.month
var day = app.globalData.day
var dayNum = app.globalData.dayNum



Page({
  data: {
    openid:''
  },
  start(){
    
    db.collection(mon[month - 1]).where({
      _openid: app.globalData.openid  //进行筛选
    }).get({
      success: res => {
        console.log(res.data.length)
        // 无信息初始化
        if (res.data.length == 0) {
          var j = 0
          // 增加每月天数
          for (var i = 0; i < dayNum[month - 1]; i++) {
            if (i < 9) {
              j = '0' + (i + 1)
            }
            else {
              j = i + 1
            }
            wx.cloud.callFunction({
              name: 'update',
              data: {
                collect: mon[month - 1],
                openid: app.globalData.openid,
                data: {
                  [mon[month - 1] + j]: { dayPrice: 0.0 }
                }
              },
              success: res => {
                //console.log(res.result)
              },
              fail: res => {
                console.log("调用失败", res)
              }
            })
          }
          // 增加月总价
          db.collection(mon[month - 1]).add({
            data: {
              monPrice: 0.0,

            },
            success: res => {
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '新增记录失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
          wx.switchTab({
            url: '../index/index',
          })
          
        }
        else {
            wx.switchTab({
              url: '../index/index',
            })
          
        }
      }
    })
  },
  subscribe() {
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: [
        '5izIuACRUSIMs8eES-Drl92yVQI52fVypgRslHyk1W8'],
      success(res) { that.start()}
    })
  },
  onLoad: function () {
  }
})
