// INITIALIZE USER ACCOUNTS DB

// attributes are: email, username, password
let DATABASE_NAME = "UserAccounts";
let VERSION = 1; // need to increment when user is registered

let req = window.indexedDB.open(DATABASE_NAME, VERSION)

// initialize
req.onupgradeneeded = () => { 
    let db = request.result,
        store = db.createObjectStore(DATABASE_NAME, {keyPath: "email"}),
        index = store.createIndex(DATABASE_NAME, "type", {unique: true});
}

request.onerror = function(e) { // runs when encounted error in opening db
    console.log("There was an error:" + e.target.errorCode);
};

/*
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
    
}*/