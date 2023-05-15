const updateRecordInDB = ({ databaseName, tableName, key, updatedFields } = {}) => {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(databaseName);

        request.onerror = function () {
            reject(new Error('Failed to open database:' + databaseName));
        };

        request.onsuccess = function (event) {
            let db = event.target.result;
            let transaction = db.transaction(tableName, 'readwrite');
            let objectStore = transaction.objectStore(tableName);

            let getRequest = objectStore.get(key);

            getRequest.onsuccess = function (event) {
                let record = event.target.result;
                if (record) {
                    // Update the record with the new fields
                    Object.assign(record, updatedFields);
                    let updateRequest = objectStore.put(record, key);

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

export default updateRecordInDB;