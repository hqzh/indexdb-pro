# 文档
基于indexdb api封装的增删改查

## api模版
函数简单介绍

函数详细介绍

函数参数和返回值（要遵守下面的例子的规则）

- databaseName {string} 数据库名
- tableName {string} 表名
- indexes {array} 索引列表
```js
[
    {
        indexName: "code",
        keyPath: 'code',
        unique: true
    },
    {
        indexName: "categories",
        keyPath: 'categories',
        unique: false
    },
    {
        indexName: "developer",
        keyPath: 'developer',
        unique: false
    },
]

```
- record,updatedFields {object} 增加修改项
```js
{
    code:'xxx',
    categories:'xxx',
    developer:'xxx'
}
```
- key {string} 修改项key
- return {promise} 返回值描述

举个例子（要包含代码用例）

```js
import {
    isTableExists,
    createIndexedDB,
    addRecordToDB,
    updateRecordInDB,
    getAllDataFromTable
}
    from 'indexdb-pro'

isTableExists({ databaseName, tableName }).then(res => console.log(res))
createIndexedDB({ databaseName, tableName, indexes }).then(...)
addRecordToDB({ databaseName, tableName, record }).then(...)
updateRecordInDB({ databaseName, tableName, key, updatedFields }).then(...)
getAllDataFromTable({ databaseName, tableName }).then(...)

```

