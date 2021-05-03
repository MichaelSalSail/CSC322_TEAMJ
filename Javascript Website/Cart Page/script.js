const DATABASE_NAME = "ShoppingCart";
const VERSION = 1;

 

function loadCart(db) {
    let tx = db.transaction(DATABASE_NAME);
    let store = tx.objectStore(DATABASE_NAME);
    let cart = document.getElementById("shopping-cart");
    let list = store.openCursor();
    list.onsuccess = (event) => { 
        let cursor = event.target.result;
        if (!cursor) return; 
        let cursorValue = cursor.value;

        const NUMBER_OF_CELLS = 3;
        let row = document.createElement('tr');
        let cells = [];
        cart.appendChild(row);

        for (let i = 0; i < NUMBER_OF_CELLS; i++){
            let cell = document.createElement('td');
            cells.push(cell);
        }

        cells[0].innerHTML = cursorValue.name;
        cells[1].innerHTML = cursorValue.price;
        cells[2].innerHTML = 1 //cursorValue.quantity;

        for (let i = 0; i < cells.length; i++) row.appendChild(cells[i]);
        cursor.continue();
    }
}

function start() {
    
    let req = window.indexedDB.open(DATABASE_NAME, VERSION);
    req.onsuccess = () => {
        loadCart(req.result);
        console.log("Cart loaded successfully.");
    };

    req.onerror = () => {
        console.log("err");
    }
}