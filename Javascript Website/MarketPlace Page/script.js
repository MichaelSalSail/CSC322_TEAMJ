// Database Constants
const DATABASE_NAME = "Components";
const VERSION = 1; // need to increment when we upgrade schema


// Store constants
// attr: "name", "description", "price", "manufacturer", "type"

const GPU = [
    ["GTX 1060", "3 GB VRAM, VR ready", 250, "Nvidia", "GPU"],
    ["GTX 1080", "8GB VRAM, VR Ready, RTX compatible", 600, "Nvidia", "GPU"],
    ["R9 270", "4GB of VRAM, double fan heatsink", 300, "AMD", "GPU"]
];

const CPU = [
    ["Core i3-7700k", "3.0 Ghz, Kirby Lake architecture", 120, "Intel", "CPU"],
    ["Ryzen 5 3600", "6 Cores, 4.2 Ghz", 200, "AMD", "CPU"],
    ["Core i7-10700k", "10 Cores, 4.5 Ghz", 250, "Intel", "CPU"]
];

const MOBO = [
    ["Z490-A PRO", "LGA1200 Socket, 64GB", 180, "MSI", "MOBO"],
    ["ROG STRIX B550", "AM4 Socket, 128GB", 200, "ASUS", "MOBO"],
    ["ASRock B450M", "AM4 Socket, 64GB", 130, "ASRock", "MOBO"]
];

const RAM = [
    ["Vengeance LPX", "DDR4-3200, 2x8GB", 90, "Corsair", "RAM"], 
    ["Trident Z RGB", "DDR4-3600", 100, "G.Skill", "RAM"],
    ["Ballistix", "DDR4-3200", 85, "Crucial", "RAM"]
];

const STORAGE = [
    ["Barracuda Compute", "2TB, 7200RPM", 60, "Seagate", "STORAGE"], 
    ["970 Evo", "1TB, SSD", 350, "Samsung", "STORAGE"],
    ["Blue SN550", "1TB, SSD", 120, "Western Digital", "STORAGE"]
];

const PSU = [
    ["RM 2019", "ATX, 80+ Gold, 750 W", 125, "Corsair", "PSU"], 
    ["BQ", "ATX, 80+ Bronze, 600W", 60, "EVGA", "PSU"],
    ["SuperNOVA GA", "ATX, 80+ Gold, 750 W", 100, "EVGA", "PSU"]
];

const CASE = [
    ["NZXT H510", "ATX Mid, White", 70, "NZXT", "CASE"], 
    ["275R Airflow", "ATX Mid, Black", 100, "Corsair", "CASE"],
    ["Eclipse P300A", "ATX Full Tower, Black", 160, "Phanteks", "CASE"]
];

const COMPONENTS = [GPU, CPU, MOBO, RAM, STORAGE, PSU, CASE];

// traverses 3D array to add component attributes to database
function initializeComponents(db) {
    tx = db.transaction(DATABASE_NAME, "readwrite");
    store = tx.objectStore(DATABASE_NAME);
    for (let outer = 0; outer < COMPONENTS.length; outer++) {
        for (let i = 0; i < COMPONENTS[0].length; i++) {
            store.put({
                name: COMPONENTS[outer][i][0],
                description: COMPONENTS[outer][i][1],
                price: COMPONENTS[outer][i][2],
                manufacturer: COMPONENTS[outer][i][3],
                type: COMPONENTS[outer][i][4]
            });
        }
    }
    
    tx.oncomplete = () => {
        console.log("Components loaded.");
        db.close();
    };
}

// creates row with td, adds image, attributes, add to cart btn
function populateRow(table, cursorValue) {
    const NUMBER_OF_CELLS = 6;
    let filePath = "../Images/" + cursorValue.type + "/" + cursorValue.name + ".jpg";
    let cells = [];
    let row = document.createElement('tr');
    table.appendChild(row);
    for (let i = 0; i < NUMBER_OF_CELLS; i++){
        let cell = document.createElement('td');
        cells.push(cell);
    }

    let img = document.createElement('img');
    img.setAttribute("style","width:200px");
    img.setAttribute("style","height:200px");
    img.src = filePath;

    cells[1].innerHTML = cursorValue.name;
    cells[2].innerHTML = cursorValue.description;
    cells[3].innerHTML = cursorValue.price;
    cells[4].innerHTML = cursorValue.manufacturer;

    for (let i = 0; i < cells.length; i++) row.appendChild(cells[i]);

    let btn = document.createElement('button');
    btn.innerHTML = "Add to Cart";
    btn.addEventListener('click', () => {
        addItemToCart(cursorValue);
    });

    cells[0].appendChild(img);
    cells[5].appendChild(btn); // add to cart
}

function addItemToCart(component) {
    let req = window.indexedDB.open("ShoppingCart", 1);
    req.onsuccess = () => {        
        let db = req.result;
        let tx = db.transaction("ShoppingCart", "readwrite");
        let store = tx.objectStore("ShoppingCart");
        store.put({
            name: component.name,
            description: component.description,
            price: component.price,
            manufacturer: component.manufacturer,
            type: component.type
        });
        db.close();
        console.log("Successfully added to cart.");
        alert("Added to cart.")
    }
}


// each table is populated with rows from database
function populateTables(db) {
    let transaction = db.transaction(DATABASE_NAME);
    let tables = transaction.objectStore(DATABASE_NAME);
    let list = tables.openCursor();
    list.onsuccess = (event) => { 
        let cursor = event.target.result;
        if (!cursor) return; 
        let cursorValue = cursor.value;

        switch(cursorValue.type) {
            case 'GPU':
                populateRow(document.getElementById('gpu-table'), cursorValue);
                break;
            case 'CPU':
                populateRow(document.getElementById('cpu-table'), cursorValue);
                break;
            case 'MOBO':
                populateRow(document.getElementById('mobo-table'), cursorValue);
                break;
            case 'RAM':
                populateRow(document.getElementById('ram-table'), cursorValue);
                break;
            case 'STORAGE':
                populateRow(document.getElementById('storage-table'), cursorValue);
                break;
            case 'PSU':
                populateRow(document.getElementById('psu-table'), cursorValue);
                break;
            case 'CASE':
                populateRow(document.getElementById('case-table'), cursorValue);
                break;
            default:
                break;
        }
        cursor.continue(); 
    }

    list.onerror = () => {
        console.log("Could not load items.")
    }
}

function hideTables() {
    document.getElementById('gpu-table').style.display = 'none';
    document.getElementById('gpu-table').style.display = 'none';    
    document.getElementById('cpu-table').style.display = 'none';
    document.getElementById('mobo-table').style.display = 'none';
    document.getElementById('ram-table').style.display = 'none';
    document.getElementById('storage-table').style.display = 'none';
    document.getElementById('psu-table').style.display = 'none';
    document.getElementById('case-table').style.display = 'none';
}

function showTables(id) {
    let table = document.getElementById(id);
    hideTables();
    table.style.display = 'block';
}

// onload in body
function start() {
    let req = window.indexedDB.open(DATABASE_NAME, VERSION);
    req.onsuccess = () => {
        console.log("Database opened successfully.");
        let db = req.result;
        populateTables(db);
        console.log("Tables populated.")
    }
    req.onupgradeneeded = (e) => { 
        let db = req.result;
        let version = e.oldVersion;
        let tx = req.transaction;
        console.log("Old version was", version);

        if (version === 0) {
            store = db.createObjectStore(DATABASE_NAME, {keyPath: 'name'}),
            index = store.createIndex("name", "name", {unique: true});
            
            tx.oncomplete = () => {
                console.log("Transcation completed.")
                initializeComponents(db);
            };
        }
    }
    req.onerror = function(e) { 
        console.log("There was an error: " + e.target.errorCode);
    };

    let req_sc = window.indexedDB.open("ShoppingCart", 1);
    req_sc.onupgradeneeded = (e) => {
        let db_sc = req_sc.result;
        let version_sc = e.oldVersion;
        console.log("Old version was", version_sc);

        if (version_sc === 0) {
            store_sc = db_sc.createObjectStore("ShoppingCart", {keyPath: 'name'}),
            index_sc = store_sc.createIndex("name", "name", {unique: true});
            console.log("Shopping Cart created.");
        }
    }

    hideTables();
}