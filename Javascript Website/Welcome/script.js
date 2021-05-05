/* Each system has the following attributes:
name, price, description, type (gaming, business, computing), operating system, sales */

function initializeSystems() {
    tx = database.transaction(SYSTEMS_DB_NAME, "readwrite");
    store = tx.objectStore(SYSTEMS_DB_NAME);
    for (let outer = 0; outer < SYSTEMS.length; outer++) {
        for (let i = 0; i < SYSTEMS[0].length; i++) {
            store.put({
                name: SYSTEMS[outer][i][0],
                price: SYSTEMS[outer][i][2],
                description: SYSTEMS[outer][i][1],
                type: SYSTEMS[outer][i][3],
                os: SYSTEMS[outer][i][4]
            });
        }
    }
    
    tx.oncomplete = () => {
        console.log("Systems loaded");
    };
}

function start() {
    let req = window.indexedDB.open(SYSTEMS_DB_NAME, VERSION);
    req.onsuccess = () => {
        database = req.result;
    }

    req.onupgradeneeded = (e) => {
        database = req.result;
        let version = e.oldVersion;
        let tx = req.transaction;
        console.log("Old version was", version);

        if (version === 0) {
            store = database.createObjectStore(SYSTEMS_DB_NAME, {keyPath: 'name'}),
            index = store.createIndex("name", "name", {unique: true});
            tx.oncomplete = () => {
                console.log("Transcation completed.")
                initializeSystems(database);
            };
        }
    }
}