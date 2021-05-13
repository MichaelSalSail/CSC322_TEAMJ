let isTableShowing = false;

function loadUserInfo() {
    let username = localStorage.getItem("username");
    let permission = localStorage.getItem("permission");
    let balance = localStorage.getItem("balance");
    let address = localStorage.getItem("address");
    if (!address) 
        document.getElementById('address').innerHTML += "N/A";
    else 
        document.getElementById('address').innerHTML += address;

    document.getElementById('username').innerHTML += username;
    document.getElementById('usertype').innerHTML += PERMISSION_STRINGS[permission];
    document.getElementById('balance').innerHTML += balance;
}

function loadPurchasesTable(){
    let numPurchases = 0;
    let email = localStorage.getItem("email");
    let req = window.indexedDB.open(PURCHASES_DB_NAME, VERSION);
    req.onsuccess = (e) => { // open a cursor for indexing the current user's purchases
        console.log("Opened purchases DB.") 
        let result = e.target.result;
        let cursorIndex = IDBKeyRange.only(email);
        let openCursor = result.transaction(PURCHASES_DB_NAME)
        .objectStore(PURCHASES_DB_NAME).index("email").openCursor(cursorIndex);
        openCursor.onsuccess = (e) => {
            let cursor = e.target.result;
            if (cursor) { // fill table here
                numPurchases++;
                console.log(cursor.value);
                populateRow(cursor.value);
                cursor.continue();
            }
            else {
                document.getElementById('numPurchases').innerHTML += numPurchases;
                console.log("Finished populating table.")
            }
        }
    }
}

function populateRow(purchase) {
    let NUM_CELLS = 4;
    let table = document.getElementById('purchases');
    let row = document.createElement('tr');
    let pendingText = purchase.pending ? "Pending" : "Completed";

    let cells = []
    for (let i = 0; i < NUM_CELLS; i++)
        cells.push(document.createElement('td'));

    cells[0].innerHTML = purchase.payment;
    cells[2].innerHTML = purchase.tracking;
    cells[3].innerHTML = pendingText;

    let purchaseText = "";
    for (let i = 0; i < purchase.purchase.length; i++) {
        let current = purchase.purchase[i];
        purchaseText +=
            "Name: " + current.name + "</br>" + 
            "Price: $" + current.price + "</br>" + 
            "Quantity: " + current.quantity + "</br> </br>";
        cells[1].innerHTML = purchaseText;
        //console.log(purchase.purchase[i]);
    }

    for (let i = 0; i < NUM_CELLS; i++) 
        row.appendChild(cells[i]);
    table.appendChild(row);
}

function start() {
    initializeNavigation();
    loadUserInfo();
    loadPurchasesTable();
    setupLoginButton();
    
    document.getElementById("purchases-btn").addEventListener('click', () => {
        let table = document.getElementById('purchases');
        if (isTableShowing) {
            table.style.display = 'none';
            isTableShowing = false;
        }
        else {
            table.style.display = 'block'
            isTableShowing = true;
        }
    })

}