## 写在前面

​        现在是2020年11月23日

​        最近时间比较多，一直想整理一下本科这两年开发的一些小作品，考虑到年后要准备考研，于是决定最近完成这项工作。

​        首先发一个比较简单的，前段时间自己做的一个记账小程序，起因是觉得花钱太多，想记录一下日常花销，于是准备自己做一个自己专用的小程序，后来觉得只能自己用太没意思了，所以它最后面向了所有用户（如果有兴趣，欢迎体验）。

​        这个小程序现在怎么样了呢？我用了一两周后，发现天天记账也很麻烦，于是就放在那不用了。唉，看来记账还是不适合我这种人，所以我把它在这里发给大家，大家如果有兴趣可以自己做一个，记得点个赞就好了

​        先声明一下，我是数学专业的，做这个仅仅是因为如上所述，并非专业。所以有很多地方做的不是很成熟，还请大家见谅！好了，下面开始

## 目录

- 小程序功能介绍
- 小程序视频展示
- 小程序数据库架构
- 小程序源码

## 小程序功能介绍

### 一.记账页面

> 第一个页面，用于记账

![image-20201123194950624](C:\Users\lenovo\AppData\Roaming\Typora\typora-user-images\image-20201123194950624.png)

- **1、价格显示**
  - 最顶端显示的是今日总价和本月总价，可以根据记账实时变化
- **2、记账功能**
  - 中间部分可以选择分类（只写了4类调试用）和支付方式。
  - 名称和价格可以自行输入
  - 输入完成后点击保存即完成一次记账，数据库会更新。清空则清除填入的内容。
  - 点击保存会自动检测输入的内容是否为空和是否合法。
  - 最下面的“今日已买”即显示今日已经记录的账单，可以实时变化。
  - “今日”已买可以删除，点击对应删除按钮即从当前页面和数据库中删除这条账单记f录。

### 二、分析页面

> 第二个页面，主要用于账单分析，分为七日支出分析和本月分析

![image-20201123195145360](C:\Users\lenovo\AppData\Roaming\Typora\typora-user-images\image-20201123195145360.png) ![image-20201123195212137](C:\Users\lenovo\AppData\Roaming\Typora\typora-user-images\image-20201123195212137.png) 

- **1、七日支出**
  - 记录了自昨日起的前七天的内容，包括七日平均日总价，七日总价，及七日账单价格走势图。
  - 查看详情和收藏分享本来打算后期开发，结果因为自己都懒得记账了，所以也至今也没有开发。不过说不定等后面哪天心血来潮可以会完成这项工作（可能性不大），如果完成了我会来更新的。
- **2、本月总计**
  - 记录了本月总价和本月的平均日总价
  - 饼状图显示了各个类别（记账时选择的类别）花销占的比例。

### 三、记账提醒功能

 ![image-20201123195510908](C:\Users\lenovo\AppData\Roaming\Typora\typora-user-images\image-20201123195510908.png) ![image-20201123195533549](C:\Users\lenovo\AppData\Roaming\Typora\typora-user-images\image-20201123195533549.png)  

- 在小程序加载之初会向用户询问是否订阅用于每天向用户发送记账提醒。
- 我这里设定的是每天晚上9:30用个人服务器自动向用户推送订阅，订阅内容包括 昨日支出，本月指出，本月收入（为了后续开发，在这里就提前加了）以及记账提醒。
- 以上基本就是小程序的全部功能，接下来的视频会展示这些功能。

## 展示视频



## 数据库架构

![image-20201123195907838](C:\Users\lenovo\AppData\Roaming\Typora\typora-user-images\image-20201123195907838.png)



- 数据库集合分为12个月份

- 每条记录对应一个用户（openid）

- 每个用户下对应本月的每一天及本月总价及openid

  ![image-20201123200023158](C:\Users\lenovo\AppData\Roaming\Typora\typora-user-images\image-20201123200023158.png)

- 每一天中，每条记账记录为一个对象，以随机生成的字符串作为id，以及本日总价

- 每一条记账记录包含了此条账单的各个属性：名称、价格、类别、支付方式等

## 源码

源码我就不一一介绍了，直接全部放在下面了。**源码中页面设计用到了vant-weapp插件。**

在这里简单介绍一下整个小程序的架构：

- 小程序加载页面通过openid查询数据库是否有历史信息，如果没有，自动初始化该用户的数据库信息，完成后跳转至首页。如过有，直接跳转至首页。

- 此过程中会询问用户是否订阅。

**记账页面**

- 从云数据库中获取本日本月信息，存放到本地用于显示。

- 每次保存账单会同时对数据库和本地信息进行更新。

**分析页面**

- 从云数据库中获取本日本月信息，存放到本地用于显示。

**源码如下**

**1、APP**

app.js

```javascript
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

```

app.json

```
{
  "usingComponents": {
    "van-dropdown-menu": "../components/dist/dropdown-menu/index",
    "van-dropdown-item": "../components/dist/dropdown-item/index",
    "van-field": "../components/dist/field/index",
    "van-button": "../components/dist/button/index",
    "van-cell": "../components/dist/cell/index",
    "van-cell-group": "../components/dist/cell-group/index",
    "van-card": "../components/dist/card/index",
    "van-radio": "../components/dist/radio/index",
    "van-radio-group": "../components/dist/radio-group/index",
    "van-sidebar": "../components/dist/sidebar/index",
    "van-sidebar-item": "../components/dist/sidebar-item/index",
    "van-tab": "../components/dist/tab/index",
    "van-tabs": "../components/dist/tabs/index",
    "van-dialog": "../components/dist/dialog/index",
    "van-grid": "../components/dist/grid/index",
    "van-grid-item": "../components/dist/grid-item/index",
    "van-divider": "../components/dist/divider/index",
    "van-image": "../components/dist/image/index",
    "van-notify": "../components/dist/notify/index"  
  },
  "pages": [
    "pages/onLoad/onLoad",
    "pages/analysis/analysis",
    "pages/index/index"
  ],
  "tabBar": {
    "color":"#000000",  
    "selectedColor": "#1CBBB4",
    "backgroundColor": "white",
    
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "/images/icon/bookkeeping_off.png",
        "selectedIconPath": "/images/icon/bookkeeping_on.png"
      },
      {
        "pagePath": "pages/analysis/analysis",
        "iconPath": "/images/icon/analysis_off.png",
        "selectedIconPath": "/images/icon/analysis_on.png"
      }
    ]
  },
  "sitemapLocation": "sitemap46.json"
}
```

app.wxss 未用到

**2、加载页面**

onLoad.wxml

```html
<view class='begin'>
<van-button
  type="default"
  bind:click="start"
>开始使用
</van-button>
</view>
<view class='text_container'>
<text>如出现问题或者有更好的建议欢迎联系</text>
<text>ywonchall@163.com</text>
</view>

```

onLoad.js

```javascript
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

```

onLoad.wxss

```
Page{
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url('base64格式图片，由于过长，故不在这里展示了，可以自行转码粘贴')
}

.begin{
  position:fixed;
  bottom:23%;
  display:flex;
  width:100%;
  justify-content:center;
}

.text_container{
    display: flex;    /*设置显示样式**/
    align-items: center;    /**子view垂直居中*/
    vertical-align: center; /**垂直居中*/
    justify-content: center; /**内容居中*/
    flex-direction:column;
    font-size: 25rpx;
    color: #666666;
    position:fixed;
    bottom:4%;
    left: 25%
}

```

**3、记账页面**

index.wxml

```
<van-dialog id="van-dialog" />
<van-notify id="van-notify" />

<view class='qs'>
  <view class = 'container'style="height: 150rpx">
    <view class='container_head'>
      <view class='container_head_main'>

        <view>

          <view class='main_Ttitle'>今日总价</view>

          <view class='main_main'>{{dayPrice}}</view>

          <!--<view class='main_mintitle'>元</view> -->

        </view>

        <view>

          <view class='main_Ttitle'>本月总价</view>

          <view class='main_main'>{{monPrice}}</view>

          <!--<view class='main_mintitle'>次/分钟</view> -->

        </view>

      </view>
    </view>

  </view>

  <view class='container'style="height: 350rpx">
    <van-dropdown-menu>
      <van-dropdown-item value="{{ categroyIndex }}" options="{{ categroy }}" bind:change="switchValue1" />
      <van-dropdown-item value="{{ paymentIndex }}" options="{{ payment }}" bind:change="switchValue2" />
    </van-dropdown-menu>

    <van-cell-group>
      <van-field
        value="{{ goodsName }}"
        label="名称"
        placeholder="请输入名称"
        border="{{ false }}"
        bind:blur="nameBlur"
      />

      <van-field
      value="{{ goodsPrice }}"
      label="价格"
      border="{{ false }}"
      placeholder="请输入价格"
      bind:change="onChange"
      type="digit"
      maxlength="6"
      />
    </van-cell-group>
  </view>
  
  <view class='btn_container' >
    <van-button class='btn' type="default" round bind:click='post'> 保 存 </van-button>
    <van-button class='btn' type="default" round bind:click='clear'> 清 空 </van-button>
  </view>

  <view class='container' style="height: auto">

    <van-divider contentPosition="center">今日已买</van-divider>
      <view  wx:for="{{today}}" wx:for-index="id" wx:for-item="value">
        <van-card
        tag="{{value.categroy}}"
        price="{{value.price}}"
        desc="支付方式:{{value.payment}}"
        title="{{value.name}}"
        thumb="{{img[value.categroy]}}"
        >
        <view slot="footer">
          <van-button size="mini"  data-id="{{id}}" bind:click="deleteData">删除</van-button>
        </view>
        </van-card>
        <text>\n</text>
      </view>
  </view>

</view>

```

index.js

```

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

```

index.wxss

```
page {

  background-color: rgba(239, 239, 240, 1);

}
.container {

  width: 690rpx;

  border-radius: 30rpx;

  background-color: rgba(255, 255, 255, 1);


  display: flex;

  flex-direction: column;

  box-sizing: border-box;

  font-size: 35rpx;

  color: #333;

  margin: 30rpx auto;

  padding: 20rpx;

}

.btn_container {

  width: 690rpx;

  border-radius: 30rpx;

  background-color: rgba(255, 255, 255, 1);

  display: flex;

  flex-direction: row;

  height: 150rpx;

  box-sizing: border-box;

  font-size: 35rpx;

  color: #333;

  margin: 30rpx auto;

  padding: 30rpx;

}

.btn{
  margin: auto 90rpx;
}
.qs {

  width: 100%;

  height: 100%;

  box-sizing: border-box;

  padding-top: 15rpx;

}


.container_head {

  width: 640rpx;

  margin: 0 auto;

  height: auto;

}


.container_head_main {

  width: 100%;

  height: 100rpx;

  display: flex;

  align-items: center;

  justify-content: space-between;

}

.container_head_main view {

  width: 50%;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

}

.main_Ttitle {

  font-size: 26rpx;

  color: #333;

  text-align: center;

  line-height: 50rpx;

}

.main_main {

  font-size: 34rpx;

  color: #333;

  text-align: center;

  font-weight: bold;

  line-height: 40rpx;

}
```

**4、分析页面**

analysis.wxml

```
<van-notify id="van-notify" />
<view class='head'>

  <view class="{{head0}}"  data-current="0"
  bindtap='checkCurrent'>七日支出</view>

  <view class='line'></view>

  <view class="{{head1}}" data-current="1" bindtap='checkCurrent'>本月总计
  </view>
</view>

<swiper current="{{currentData}}" class='swiper' style="height:600px;" duration="300" bindchange="bindchange">
  <swiper-item>
    
    <view class='swiper_con'>
      
      <view class='mymain'>

        <view class='qs'>

          <view class="container">

            <view class='container_head'>

              <view class='container_head_top'>

                <view class='prev' bindtap="look">

                  <text class='iconfont icon-iconfontzhizuobiaozhun023126'></text>

                  <text>查看详情 </text>

                </view>

                <view class='top_title'>{{week[0]}}~{{week[6]}}</view>

                <view class='next' bindtap="share">

                  <text>收藏分享</text>

                  <text class='iconfont icon-jiantouyou'></text>

                </view>

              </view>

              <view class='container_head_main'>

                <view>

                  <view class='main_Ttitle'>平均日总价</view>

                  <view class='main_main'>{{dayMean}}</view>

                  <!--<view class='main_mintitle'>元</view> -->

                </view>

                <view>

                  <view class='main_Ttitle'>七日总价</view>

                  <view class='main_main'>{{weekSum}}</view>

                  <!--<view class='main_mintitle'>次/分钟</view> -->

                </view>

              </view>

            </view>
            
            <canvas canvas-id="lineCanvas" disable-scroll="true" class="canvas" bindtouchstart="touchHandler"></canvas>

          </view>
        </view>
        
      </view>
      
    </view>
   
  </swiper-item>

  <swiper-item>
    <view class='swiper_con'>
       <view class='mymain'>

        <view class='qs'>

          <view class="container">

            <view class='container_head'>

              <view class='container_head_top'>

                <view class='prev' bindtap="look">

                  <text class='iconfont icon-iconfontzhizuobiaozhun023126'></text>

                  <text>查看详情 </text>

                </view>

                <view class='top_title'>{{mon[month-1]}}</view>

                <view class='next' bindtap="share">

                  <text>收藏分享</text>

                  <text class='iconfont icon-jiantouyou'></text>

                </view>

              </view>

              <view class='container_head_main'>

                <view>

                  <view class='main_Ttitle'>本月总价</view>

                  <view class='main_main'>{{monPrice}}</view>

                  <!--<view class='main_mintitle'>元</view> -->

                </view>

                <view>

                  <view class='main_Ttitle'>平均日总价</view>

                  <view class='main_main'>{{monMean}}</view>

                  <!--<view class='main_mintitle'>次/分钟</view> -->

                </view>

              </view>

            </view>

            <canvas canvas-id="pieCanvas" disable-scroll="true" class="canvas"></canvas>

          </view>
        </view>
        
      </view>
      
    </view>
  </swiper-item>
 
</swiper>


```

analysis.js

```

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

```

analysis.wxss

```
/* pages/index/lookrecord/lookrecord.wxss */

page {

  background-color: rgba(239, 239, 240, 1);

}

.head_item {

  width: 374rpx;

  text-align: center;

  font-size: 34rpx;

  color: #999;

  letter-spacing: 0;

}

.head_itemActive {

  color: rgba(87, 213, 200, 1);

}

.line {

  width: 2rpx;

  height: 80%;

  background-color: rgba(204, 204, 204, 1);

}

.head {

  width: 92%;
  border-radius: 30rpx;
  height: 100rpx;

  background-color: rgba(255, 255, 255, 1);

  display: flex;

  align-items: center;

  justify-content: space-between;

  position: fixed;

  top: 40rpx;
  left:30rpx;
  z-index: 10;

}

.mymain {

  position: absolute;

  width: 100%;

  height: 100%;

  display: block;

  box-sizing: border-box;

  padding-top: 60rpx;

  top: 0;

}

.xyjl {

  width: 100%;

  height: 100%;

  box-sizing: border-box;

  padding: 0rpx 30rpx;

}

.item_title {

  width: 100%;

  height: 91rpx;

  line-height: 90rpx;

  font-size: 26rpx;

  color: #999;

  letter-spacing: 0;

}

.item_main {

  border-radius: 30rpx;

  background-color: rgba(255, 255, 255, 1);

  width: 100%;

  height: auto;

  box-sizing: border-box;

  padding: 0rpx 40rpx;

}

.icon-jiantouyou, .icon-icon_arrow_top, .icon-jiantouxia,

.icon-iconfontzhizuobiaozhun023126 {

  font-size: 30rpx;

  color: rgba(199, 199, 204, 1);

}

.main_title {

  width: 100%;

  height: 250rpx;

  box-sizing: border-box;

  padding: 30rpx 0rpx;

  display: flex;

  align-items: center;

  justify-content: space-between;

}

.main_item {

  width: 100%;

  height: 200rpx;

  box-sizing: border-box;

  padding: 30rpx 0rpx;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border-top: 1rpx solid rgba(216, 216, 216, 1);

}

.title_kind {

  width: 150rpx;

  height: 100%;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  align-items: center;

}

.kind_title {

  font-size: 26rpx;

  color: #333;

  text-align: center;

  line-height: 30rpx;

}

.kind_number {

  font-size: 34rpx;

  color: #d63030;

  letter-spacing: 0;

  line-height: 45rpx;

}

.kind_numberSussece {

  color: rgba(99, 218, 121, 1);

}

.kind_dw {

  font-size: 26rpx;

  color: #333;

  line-height: 45rpx;

}

.kind_result {

  display: inline-block;

  height: 45rpx;

  padding: 0rpx 20rpx;

  border: 2rpx solid #e68a8a;

  border-radius: 100rpx;

  font-size: 26rpx;

  color: #d73737;

  line-height: 40rpx;

}

.kind_resultSuccess {

  border: 2rpx solid rgba(99, 218, 121, 1);

  color: rgba(99, 218, 121, 1);

}

.qs {

  width: 100%;

  height: 100%;

  box-sizing: border-box;

  padding-top: 80rpx;

}

.container {

  width: 690rpx;

  border-radius: 30rpx;

  background-color: rgba(255, 255, 255, 1);

  height: 950rpx;

  display: flex;

  flex-direction: column;

  box-sizing: border-box;

  font-size: 35rpx;

  color: #333;

  margin: 40rpx auto;

}

.container_head {

  width: 640rpx;

  margin: 0 auto;

  height: auto;

}

.container_head_top {

  width: 100%;

  height: 100rpx;

  border-bottom: 1rpx solid rgba(216, 216, 216, 1);

  display: flex;

  align-items: center;

  justify-content: space-between;

}

.canvas {

  width: 100%;

  height: 550rpx;

  margin-top: 30rpx;

}

.prev, .next {

  width: 130rpx;

  border-radius: 100rpx;

  display: flex;

  justify-content: space-between;

  font-size: 24rpx;

  align-items: center;

  color: #fff;

  box-sizing: border-box;

  padding: 3rpx 15rpx 0rpx 15rpx;

  line-height: 50rpx;

  background-color: rgba(87, 213, 200, 1);

}

.prev text {

  display: block;

}

.next text {

  display: block;

}

.iconfont {

  font-size: 20rpx;

  color: #fff;

}

.top_title {

  font-size: 26rpx;

  color: #333;

}

.container_head_main {

  width: 100%;

  height: 170rpx;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border-bottom: 1rpx solid rgba(216, 216, 216, 1);

}

.container_head_main view {

  width: 50%;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

}

.main_Ttitle {

  font-size: 26rpx;

  color: #333;

  text-align: center;

  line-height: 50rpx;

}

.main_main {

  font-size: 34rpx;

  color: #333;

  text-align: center;

  font-weight: bold;

  line-height: 40rpx;

}

.main_mintitle {

  font-size: 26rpx;

  color: #333;

  text-align: center;

  line-height: 50rpx;

}

.tab {
  float: left;
  width: 33.3333%;
  text-align: center;
  padding: 10rpx 0;
}

.topTabSwiper {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  zoom: 1;
}

.topTabSwiper:after {
  content: "";
  clear: both;
  display: block;
}

.tabBorer {
  border-bottom: 1px solid #f00;
  color: #f00;
}

.swiper {
  width: 100%;
}

.swiper_con {
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 80rpx 0;
}

/*  */

.person_box {
  position: relative;
}

.phone_select {
  margin-top: 0;
  z-index: 100;
  position: absolute;
}

.select_one {
  text-align: center;
  background-color: rgb(239, 239, 239);
  width: 676rpx;
  height: 100rpx;
  line-height: 100rpx;
  margin: 0 5%;
  border-bottom: 2rpx solid rgb(255, 255, 255);
}
```

**5、云函数**

get

```
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
const db = cloud.database()
exports.main = async (event, context) => {
  // collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果
  
  return db.collection(event.collect).where({ _openid: event.openid}).get()
}
```

remove

```
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  // collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果

  return await db.collection(event.collect).where({ _openid: event.openid }).update({
    data: {
      [event.data]:_.remove()
    }
  })
}

```

update

```
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
const db = cloud.database()
exports.main = async (event, context) => {
  // collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果

  return await db.collection(event.collect).where({ _openid: event.openid }).update({
    data: event.data
  })
}
```

## 写在最后

**以上就是全部代码，大家如果感兴趣可以到我的github上下载源码，记得star~万分感谢！**

**小程序码放在这里，欢迎大家扫码体验~如果有问题欢迎留言~**

![gh_e96affd8a7e0_258](C:\Users\lenovo\Desktop\gh_e96affd8a7e0_258.jpg)

