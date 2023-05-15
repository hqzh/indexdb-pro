const isTableExists = ({ databaseName, tableName } = {}) => {
    if (!databaseName || typeof databaseName !== 'string' || !tableName || typeof tableName !== 'string') {
        throw new Error('参数错误，必须传入字符串类型的 databaseName 和 tableName 参数');
    }
    return new Promise((resolve, reject) => {
        // 打开 IndexedDB 数据库
        const request = window.indexedDB.open(databaseName);
        request.onerror = () => {
            reject(new Error('无法打开数据库'));
        };
        request.onsuccess = (event) => {
            const db = event.target.result;
            // 检查表是否存在
            const tableExists = db.objectStoreNames.contains(tableName);
            if (tableExists) {
                resolve(true);
                db.close();
            } else {
                // 删除数据库
                db.close();
                const deleteRequest = window.indexedDB.deleteDatabase(databaseName);
                deleteRequest.onerror = () => {
                    reject(new Error('无法删除数据库'));
                };
                deleteRequest.onsuccess = () => {
                    resolve(false);
                };
            }
        };
    });
};

export default isTableExists;