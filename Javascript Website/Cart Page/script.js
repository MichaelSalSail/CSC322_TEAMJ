const DATABASE_NAME = "ShoppingCart";

function loadTables(db) {
    
}

function start() {
    let req = window.indexedDB.open("ShoppingCart", 1);
    req.onsuccess = () => {
        let db = req.result;
        let tx = db.transaction("ShoppingCart", "readwrite");
        let store = tx.objectStore("ShoppingCart");

        let table = document.getElementById("shopping-cart");

    };
}