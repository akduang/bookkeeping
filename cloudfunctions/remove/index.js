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
