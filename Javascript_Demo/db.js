//userID, name, email, password

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB; // let indexedDB work with most browsers

let request = window.indexedDB.open("UserDatabase", 1), db, tx, store, index; //Open indexedDB database

request.onupgradeneeded = function(e) { // runs when database needs to be updated or doesn't exist yet
    let  db = request.result,
        store = db.createObjectStore("UserStore", {keyPath: "userID"}), // key will be an ID that is incremented
        index = store.createIndex("userEmail", "email", {unique: true}); // Creating index to type so we can search hardware by type

}

request.onerror = function(e) { // runs when encounted error in opening db
    console.log("There was an error:" + e.target.errorCode);
};

request.onsuccess = function(e) { // runs when databse exists
    db = request.result; // setting variables to work with
    tx = db.transaction("UserStore", "readwrite");
    store = tx.objectStore("UserStore");
    index = store.index("userEmail");

    db.onerror = function(e) {
        console.log("ERROR" + e.target.errorCode);
    }

    store.put({userID: 0, name: "Daniel", email: "dhdan97@gmail.com", password: "dhdan97"});
    store.put({userID: 1, name: "Michael", email: "MSail@Hotmail.com", password: "Msail1234"});

    tx.oncomplete = function() {
        db.close();
    };

}