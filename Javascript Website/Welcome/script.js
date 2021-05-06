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

// skip is an array with indices that correspond to which link to skip
// must be in least to greatest index order
function createLinks(skip) {
    let skipIndex = 0;
    let container = document.getElementById("links");
    for (let i = 0; i < LINK_NAMES.length; i++) {
        if (i === skip[skipIndex]) {
            console.log("Currently Skipping", LINK_NAMES[i], "where i is", i, "and skipIndex is", skipIndex);
            skipIndex++;
            continue;
        }
        let link = document.createElement('a');
        let newLine = document.createElement('br');
        container.appendChild(newLine);
        link.setAttribute('href', HREFS[i]);
        link.innerHTML = LINK_NAMES[i];
        container.appendChild(link);
    }
}

function initalizeNavigation() {
    let permission = parseInt(window.localStorage.getItem("permission"));
    console.log(permission);
    const HOME = 0;
    const ACCOUNT_INFO = 1;
    const MARKETPLACE = 2;
    const SHOPPING_CART = 3;
    const FORUM = 4;
    const DELIVERY = 5;

    switch (permission) {
        case 0: // visitor
            createLinks([ACCOUNT_INFO, SHOPPING_CART, DELIVERY]);
            break;
        case 1: // user
            createLinks([DELIVERY]);
            break;   
        case 2: // deliverer
            createLinks([MARKETPLACE, SHOPPING_CART, FORUM]);
            break;
    }
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

    initalizeNavigation();
}