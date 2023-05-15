/*!
 * indexdb-pro 0.1.0 (https://github.com/hqzh/indexdb-pro)
 * API https://github.com/hqzh/indexdb-pro/blob/master/doc/api.md
 * Copyright 2017-2023 hqzh. All Rights Reserved
 * Licensed under MIT (https://github.com/hqzh/indexdb-pro/blob/master/LICENSE)
 */

var isTableExists = function isTableExists() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    databaseName = _ref.databaseName,
    tableName = _ref.tableName;
  if (!databaseName || typeof databaseName !== 'string' || !tableName || typeof tableName !== 'string') {
    throw new Error('参数错误，必须传入字符串类型的 databaseName 和 tableName 参数');
  }
  return new Promise(function (resolve, reject) {
    // 打开 IndexedDB 数据库
    var request = window.indexedDB.open(databaseName);
    request.onerror = function () {
      reject(new Error('无法打开数据库'));
    };
    request.onsuccess = function (event) {
      var db = event.target.result;
      // 检查表是否存在
      var tableExists = db.objectStoreNames.contains(tableName);
      if (tableExists) {
        resolve(true);
        db.close();
      } else {
        // 删除数据库
        db.close();
        var deleteRequest = window.indexedDB.deleteDatabase(databaseName);
        deleteRequest.onerror = function () {
          reject(new Error('无法删除数据库'));
        };
        deleteRequest.onsuccess = function () {
          resolve(false);
        };
      }
    };
  });
};

var createIndexedDB = function createIndexedDB() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    databaseName = _ref.databaseName,
    tableName = _ref.tableName,
    indexes = _ref.indexes;
  if (!databaseName || typeof databaseName !== 'string' || !tableName || typeof tableName !== 'string') {
    throw new Error('参数错误，必须传入字符串类型的 databaseName 和 tableName 参数');
  }
  // 验证索引是否为数组
  if (!Array.isArray(indexes)) {
    throw new Error('必须提供一个数组以进行索引');
  }
  return new Promise(function (resolve, reject) {
    // 打开指定的数据库，如果不存在则创建它
    var request = indexedDB.open(databaseName);

    // 处理打开数据库的请求
    request.onerror = function (event) {
      console.error("\u65E0\u6CD5\u6253\u5F00".concat(databaseName, "\u6570\u636E\u5E93\uFF1A").concat(event.target.error));
      reject(false);
    };
    request.onupgradeneeded = function (event) {
      // 获取数据库实例和事务
      var db = event.target.result;
      var transaction = event.target.transaction;

      // 如果表不存在，则创建新表
      if (!db.objectStoreNames.contains(tableName)) {
        var table = db.createObjectStore(tableName, {
          autoIncrement: true
        }); //自动生成自增键。

        // 添加所需的索引
        indexes.forEach(function (index) {
          var indexName = index.indexName,
            keyPath = index.keyPath,
            unique = index.unique;
          table.createIndex(indexName, keyPath, {
            unique: unique
          });
        });
        console.log("\u5DF2\u5728".concat(databaseName, "/").concat(tableName, "\u4E2D\u521B\u5EFA\u65B0\u8868"));
      } else {
        console.log("".concat(databaseName, "/").concat(tableName, "\u4E2D\u7684\u8868\u5DF2\u7ECF\u5B58\u5728"));
      }

      // 确认创建表的事务完成
      transaction.oncomplete = function () {
        resolve(true);
      };
    };
  })["catch"](function (error) {
    console.error("\u53D1\u751F\u9519\u8BEF\uFF1A".concat(error));
    return false;
  });
};

var addRecordToDB = function addRecordToDB() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    databaseName = _ref.databaseName,
    tableName = _ref.tableName,
    record = _ref.record;
  if (!databaseName || typeof databaseName !== 'string' || !tableName || typeof tableName !== 'string') {
    throw new Error('参数错误，必须传入字符串类型的 databaseName 和 tableName 参数');
  }
  return new Promise(function (resolve, reject) {
    var request = window.indexedDB.open(databaseName);
    request.onerror = function () {
      reject(new Error('Failed to open database:' + databaseName));
    };
    request.onsuccess = function (event) {
      var db = event.target.result;
      var transaction = db.transaction(tableName, 'readwrite');
      var objectStore = transaction.objectStore(tableName);
      var addRequest = objectStore.add(record);
      addRequest.onsuccess = function () {
        resolve(true);
      };
      addRequest.onerror = function (event) {
        reject(new Error('Failed to add record to database:' + event.target.error));
      };
    };
  });
};

var updateRecordInDB = function updateRecordInDB() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    databaseName = _ref.databaseName,
    tableName = _ref.tableName,
    key = _ref.key,
    updatedFields = _ref.updatedFields;
  return new Promise(function (resolve, reject) {
    var request = window.indexedDB.open(databaseName);
    request.onerror = function () {
      reject(new Error('Failed to open database:' + databaseName));
    };
    request.onsuccess = function (event) {
      var db = event.target.result;
      var transaction = db.transaction(tableName, 'readwrite');
      var objectStore = transaction.objectStore(tableName);
      var getRequest = objectStore.get(key);
      getRequest.onsuccess = function (event) {
        var record = event.target.result;
        if (record) {
          // Update the record with the new fields
          Object.assign(record, updatedFields);
          var updateRequest = objectStore.put(record, key);
          updateRequest.onsuccess = function () {
            resolve(true);
          };
          updateRequest.onerror = function (event) {
            reject(new Error('Failed to update record in database:' + event.target.error));
          };
        } else {
          reject(new Error('Record not found in database'));
        }
      };
      getRequest.onerror = function (event) {
        reject(new Error('Failed to get record from database:' + event.target.error));
      };
    };
  });
};

function getAllDataFromTable() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    databaseName = _ref.databaseName,
    tableName = _ref.tableName;
  if (!databaseName || typeof databaseName !== 'string' || !tableName || typeof tableName !== 'string') {
    throw new Error('参数错误，必须传入字符串类型的 databaseName 和 tableName 参数');
  }
  return new Promise(function (resolve, reject) {
    // 打开指定的 IndexedDB 数据库
    var request = window.indexedDB.open(databaseName);
    request.onerror = function () {
      reject(new Error('无法打开数据库'));
    };
    request.onsuccess = function (event) {
      var db = event.target.result;
      // 从指定的表中获取所有数据
      var transaction = db.transaction(tableName, 'readonly');
      var objectStore = transaction.objectStore(tableName);
      var getAllRequest = objectStore.getAll();
      getAllRequest.onerror = function () {
        reject(new Error('无法获取数据'));
      };
      getAllRequest.onsuccess = function () {
        var records = getAllRequest.result;
        var cursorRequest = objectStore.openCursor();
        cursorRequest.onsuccess = function (event) {
          var cursor = event.target.result;
          if (cursor) {
            var record = records.find(function (r) {
              return r.id === cursor.value.id;
            });
            record.id = cursor.key;
            cursor["continue"]();
          } else {
            resolve(records);
          }
        };
      };
    };
  });
}

export { isTableExists, createIndexedDB, addRecordToDB, updateRecordInDB, getAllDataFromTable };
