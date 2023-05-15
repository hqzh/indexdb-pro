const addRecordToDB = ({ databaseName, tableName, record } = {}) => {
    if (!databaseName || typeof databaseName !== 'string' || !tableName || typeof tableName !== 'string') {
        throw new Error('参数错误，必须传入字符串类型的 databaseName 和 tableName 参数');
    }

    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(databaseName);

        request.onerror = function () {
            reject(new Error('Failed to open database:' + databaseName));
        };

        request.onsuccess = function (event) {
            let db = event.target.result;
            let transaction = db.transaction(tableName, 'readwrite');
            let objectStore = transaction.objectStore(tableName);

            let addRequest = objectStore.add(record);

            addRequest.onsuccess = function () {
                resolve(true);
            };

            addRequest.onerror = function (event) {
                reject(new Error('Failed to add record to database:' + event.target.error));
            };
        };
    });
};

export default addRecordToDB;
