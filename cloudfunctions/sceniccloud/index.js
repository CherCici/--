// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  //集合名称
  var dbname=event.dbname;
  //筛选条件 默认为空
  var filter=event.filter?event.filter:null;
  //当前第几页，默认为第一页
  var pageIndex=event.pageIndex?event.pageIndex:1;
  //每页取多少条记录·，默认20条
  var pageSize=event.pageSize?event.pageSize:20;
  // 先取出集合记录总数
  const countResult = await db.collection(dbname).where(filter).count()
  const total = countResult.total
  // 计算需分几次取
  //计算总页数
  const totalPage = Math.ceil(total / 20)
  //提示前端是否还有数据
  var hasMore;
  //如果没有数据返回false
  if(pageIndex>totalPage||pageIndex==totalPage){
    hasMore=false;
  }
  else{
    hasMore=true;
  }
  //最后查询数据并返回给前端
  return db.collection(dbname).where(filter).skip((pageIndex-1)*pageSize).get().then(res=>{
    res.hasMore=hasMore;
    return res;
  });
}