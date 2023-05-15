const createIndexedDB = ({ databaseName, tableName, indexes } = {}) => {
    if (!databaseName || typeof databaseName !== 'string' || !tableName || typeof tableName !== 'string') {
        throw new Error('参数错误，必须传入字符串类型的 databaseName 和 tableName 参数');
    }
    // 验证索引是否为数组
    if (!Array.isArray(indexes)) {
        throw new Error('必须提供一个数组以进行索引');
    }
    return new Promise((resolve, reject) => {
        // 打开指定的数据库，如果不存在则创建它
        const request = indexedDB.open(databaseName);

        // 处理打开数据库的请求
        request.onerror = (event) => {
            console.error(`无法打开${databaseName}数据库：${event.target.error}`);
            reject(false);
        };

        request.onupgradeneeded = (event) => {
            // 获取数据库实例和事务
            const db = event.target.result;
            const transaction = event.target.transaction;

            // 如果表不存在，则创建新表
            if (!db.objectStoreNames.contains(tableName)) {
                const table = db.createObjectStore(tableName, { autoIncrement: true }); //自动生成自增键。

                // 添加所需的索引
                indexes.forEach((index) => {
                    const { indexName, keyPath, unique } = index;
                    table.createIndex(indexName, keyPath, { unique });
                });

                console.log(`已在${databaseName}/${tableName}中创建新表`);
            } else {
                console.log(`${databaseName}/${tableName}中的表已经存在`);
            }

            // 确认创建表的事务完成
            transaction.oncomplete = () => {
                resolve(true);
            };
        };
    }).catch((error) => {
        console.error(`发生错误：${error}`);
        return false;
    });
};


export default createIndexedDB;