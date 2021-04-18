//hardwareID, name, type, description

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB; // let indexedDB work with most browsers

let request = window.indexedDB.open("HardwareComponentsDatabase", 1), db, tx, store, index; //Open indexedDB database

request.onupgradeneeded = function(e) { // runs when database needs to be updated or doesn't exist yet
    let  db = request.result,
        store = db.createObjectStore("HardwareStore", {keyPath: "hardwareID"}), // key will be an ID that is incremented
        index = store.createIndex("HardwareType", "type", {unique: false}); // Creating index to type so we can search hardware by type

}

request.onerror = function(e) { // runs when encounted error in opening db
    console.log("There was an error:" + e.target.errorCode);
};

request.onsuccess = function(e) { // runs when databse exists
    db = request.result; // setting variables to work with
    tx = db.transaction("HardwareStore", "readwrite");
    store = tx.objectStore("HardwareStore");
    index = store.index("HardwareType");

    db.onerror = function(e) {
        console.log("ERROR" + e.target.errorCode);
    }

    store.put({hardwareID: 0, name: "GTX 1080", type: "GPU", description: ""});
    store.put({hardwareID: 1, name: "Intel i7-7700K", type: "CPU", description: ""});

    tx.oncomplete = function() {
        db.close();
    };

}