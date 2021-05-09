let database;

/* Each system has the following attributes:
name, price, description, type (gaming, business, computing), operating system, sales */
function initializeSystems(database) {
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
    req.onsuccess = (e) => {
        console.log("Systems database loaded.");
        database = e.target.result;
    }
    req.onupgradeneeded = (e) => {
        tx = req.transaction;
        createStore(e, SYSTEMS_DB_NAME, "name");
        tx.oncomplete = () => initializeSystems(e.target.result);
    }
    initializeNavigation();
}