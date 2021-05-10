let database;


function displayStaffSystems() {
    let container = document.getElementById('suggested-pcs')
    for (let i = 0; i < 3; i++) {
        let subContainer = document.createElement("div");
        subContainer.style.display = 'inline';
        subContainer.style.float = 'left';
        subContainer.style.padding = "5%";
        let info = document.createElement("span"); 
        info.innerHTML = "</br>"       
        for (let j = 0; j < STAFF_SYSTEMS[0].length; i++) {
            info.innerHTML += STAFF_SYSTEMS[i][j] + "</br>"
        }
        subContainer.appendChild(createImage(currentSystem, ".PNG"));
        subContainer.appendChild(info);
        container.appendChild(subContainer);
    }
}

function displayMostSoldSystems(systems) {
    // top 3 most sold
    let container = document.getElementById('most-sold-pcs');
    for (let i = 0; i < 3; i++) {
        let subContainer = document.createElement("div");
        subContainer.style.display = 'inline';
        subContainer.style.float = 'left';
        subContainer.style.padding = "5%";
        let currentSystem = systems[i];
        let info = document.createElement("span");
        //info.setAttribute("style", "display: inline")
        info.innerHTML = 
            "</br>" + currentSystem.name + "</br>" +
            currentSystem.type + "</br>" +
            "$" + currentSystem.price + "</br>" +
            "Units sold: " + currentSystem.sales + "</br>";
        subContainer.appendChild(createImage(currentSystem, ".PNG"));
        subContainer.appendChild(info);
        container.appendChild(subContainer);
    }
}

function loadMostSoldSystems() {
    let topSales = [];
    let tx = database.transaction(SYSTEMS_DB_NAME);
    let store = tx.objectStore(SYSTEMS_DB_NAME);
    let idx = store.index('sales');
    idx.openCursor(null, "prev").onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            topSales.push(cursor.value);
            cursor.continue();
        } else {
            console.log(topSales[0].sales);
            displayMostSoldSystems(topSales);
        }
    };
}

/* Each system has the following attributes:
name, price, description, type (gaming, business, computing), operating system, sales */
function initializeSystems(database) {
    tx = database.transaction(SYSTEMS_DB_NAME, "readwrite");
    store = tx.objectStore(SYSTEMS_DB_NAME);
    for (let outer = 0; outer < SYSTEMS.length; outer++) {
        for (let i = 0; i < SYSTEMS[0].length; i++) {
            let saleNumber = Math.round((Math.random()*10000) + 1) // sale # will be from 1-10000
            store.put({
                name: SYSTEMS[outer][i][0],
                price: SYSTEMS[outer][i][1],
                description: SYSTEMS[outer][i][2],
                type: SYSTEMS[outer][i][3],
                os: SYSTEMS[outer][i][4],
                manufacturer: SYSTEMS[outer][i][5],
                sales: saleNumber
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
        loadMostSoldSystems();
    }
    req.onupgradeneeded = (e) => {
        tx = req.transaction;
        let version = e.oldVersion;
        if (version === 0) {
            store = e.target.result.createObjectStore(SYSTEMS_DB_NAME, {keyPath: "name"}),
            store.createIndex("name", "name", {unique: true});
            store.createIndex("sales", "sales", {unique:false});
        }
        tx.oncomplete = () => {
            initializeSystems(e.target.result);
            console.log("Loaded systems in database.")
        }
    }
    displayStaffSystems()
    initializeNavigation();
    
}