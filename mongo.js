const MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/meizi'

const createTable = (dbName, tableName) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err
    console.log('数据库已创建')
    const dbase = db.db(dbName)
    dbase.createCollection(tableName, function(err, res) {
      if (err) throw err
      console.log(`数据库${dbName}创建${tableName}表成功!`)
      db.close()
    })
  })
}
const insertData = (dbName, tableName, data) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err
    const dbase = db.db(dbName)
    dbase.collection(dbName).insertOne(data, (err, res) => {
      if (err) throw err
      console.log(`${tableName}表插入数据成功`)
      db.close()
    })
  })
}
const mongo = {
  createTable,
  insertData
}
module.exports = mongo
// const dbName = 'meizi',
//   tableName = 'meizi',
//   data = { name: '搜狗', value: 'www.sougou.com' }
// insertData(dbName, tableName, data)
// createTable('meizi', 'meizi')
