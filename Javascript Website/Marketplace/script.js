// Database Constants
const DATABASE_NAME = "Components";
const VERSION = 1; // need to increment when we upgrade schema

// Store constants
// NAME, DESCRIPTION, PRICE, MANUFACTURER, TYPE
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
    ["Ballistix", "DDR4_3200", 85, "Crucial", "RAM"]
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

// onload in body
function start() {
    let req = window.indexedDB.open(DATABASE_NAME, VERSION);
    req.onsuccess = () => console.log("Database opened successfully.")
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
}