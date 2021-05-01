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
        let filePath = "../Images/" + cursorValue.type + "/" + cursorValue.name + ".jpg";

        const NUMBER_OF_CELLS = 5;
        let row = document.createElement('tr');
        let cells = [];
        cart.appendChild(row);

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
        cells[0].appendChild(img);
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