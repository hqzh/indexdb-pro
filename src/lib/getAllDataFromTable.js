const getAllDataFromTable = ({ databaseName, tableName } = {}) => {
    if (!databaseName || typeof databaseName !== 'string' || !tableName || typeof tableName !== 'string') {
        throw new Error('参数错误，必须传入字符串类型的 databaseName 和 tableName 参数');
    }
    return new Promise((resolve, reject) => {
        // 打开指定的 IndexedDB 数据库
        const request = window.indexedDB.open(databaseName);
        request.onerror = () => {
            reject(new Error('无法打开数据库'));
        };
        request.onsuccess = (event) => {
            const db = event.target.result;
            // 从指定的表中获取所有数据
            const transaction = db.transaction(tableName, 'readonly');
            const objectStore = transaction.objectStore(tableName);
            const getAllRequest = objectStore.getAll();
            getAllRequest.onerror = () => {
                reject(new Error('无法获取数据'));
            };
            getAllRequest.onsuccess = () => {
                const records = getAllRequest.result;
                const cursorRequest = objectStore.openCursor();
                cursorRequest.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const record = records.find((r) => r.id === cursor.value.id);
                        record.id = cursor.key;
                        cursor.continue();
                    } else {
                        resolve(records);
                    }
                };
            };
        };
    });
};

export default getAllDataFromTable;
