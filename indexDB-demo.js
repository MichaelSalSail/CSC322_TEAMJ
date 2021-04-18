let request = window.indexedDB.open("database", 1),
    db, 
    tx, //transaction
    store, 
    index;

request.onerror = function (e) {
    console.log(e.target.errorCode);
};

request.onupgradeneeded = function (e) {
    let db = request.result,
        store = db.createObjectStore("UsernameStore", {
            keyPath: "userID"
        }),
        index = store.
            createIndex("username", "username", {unique: true});
};

request.onsuccess = function (e) {
    db = request.result;
    tx = db.transaction("UsernameStore", "readwrite");
    store = tx.objectStore("UsernameStore");
    index = store.index("username");

    db.onerror = function (e) {
        console.log("error" + e.target.errorCode);
    }

    store.put({
        userID: 1,
        username: "abc"
    })

    let q = store.get(1);
    let id = index.get("abc");

    q.onsuccess = function () {
        console.log(q.result);
        console.log(q.result.username);
    };

    id.onsuccess = function () {
        console.log(id.result.userID);
    };


    tx.oncomplete = function () {
        db.close();
    };
};