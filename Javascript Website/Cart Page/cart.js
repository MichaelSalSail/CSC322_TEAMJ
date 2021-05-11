function loadCart(db) {
    let totalPrice = 0;
    let tx = db.transaction(CART_DB_NAME);
    let store = tx.objectStore(CART_DB_NAME);
    let cart = document.getElementById("shopping-cart");
    let list = store.openCursor();
    list.onsuccess = (event) => { 
        let cursor = event.target.result;
        if (!cursor) { // done going through all the items
            window.localStorage.setItem("payment", ""+totalPrice);
            document.getElementById('total-price').innerHTML += totalPrice;
            return; 
        }
        let cursorValue = cursor.value;

        const NUMBER_OF_CELLS = 4;
        let row = document.createElement('tr');
        let cells = [];
        cart.appendChild(row);

        for (let i = 0; i < NUMBER_OF_CELLS; i++){
            let cell = document.createElement('td');
            cells.push(cell);
        }

        cells[0].innerHTML = cursorValue.name;
        cells[1].innerHTML = cursorValue.price;
        cells[2].innerHTML = cursorValue.quantity;

        let btn = document.createElement("button");
        btn.innerHTML = "Remove from cart";
        btn.addEventListener('click', () => removeFromCart(db, cursorValue.name));
        cells[3].appendChild(btn);

        for (let i = 0; i < NUMBER_OF_CELLS; i++) row.appendChild(cells[i]);

        totalPrice += cursorValue.price * cursorValue.quantity;
        cursor.continue();
    }
}

function removeFromCart(db, key) {
    let tx = db.transaction(CART_DB_NAME, 'readwrite');
    let store = tx.objectStore(CART_DB_NAME);
    let req = store.delete(key);
    req.onsuccess = () => alert("Item removed from the cart.");
    window.location.reload(); 
    return false;
}

function checkUserBalance() {
    let balance = parseInt(localStorage.getItem("balance"));
    let purchase = parseInt(localStorage.getItem("payment"));
    if (balance < purchase) 
        alert("You do not have the sufficient funds to buy this.");
    else 
        window.location.href = '../Checkout/Checkout_I_index.html';
}

function start() {
    setupLoginButton();
    initializeNavigation();
    let req = window.indexedDB.open(CART_DB_NAME, VERSION);
    req.onsuccess = () => {
        loadCart(req.result);
        console.log("Cart loaded successfully.");
    };

    req.onerror = () => {
        console.log("err");
    }
}