let database;
let purchasesDB; 
let username; 

function loadDeliverer() {
    /*
    let pendingTab = document.getElementById('pending-tab');
    let pendingDisplay = document.getElementById('pending-display');
    pendingTab.style.display = 'none'; 
    pendingDisplay.style.display = 'none';*/

    //let result = e.target.result;
    let openCursor = purchasesDB.transaction(PURCHASES_DB_NAME)
    .objectStore(PURCHASES_DB_NAME).openCursor();
    openCursor.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            //console.log(cursor.key);
            //console.log(cursor.value);
            populateRow(cursor);
            cursor.continue();
        }
        else {
            console.log("There are no more purchases.")
        }
    }
}

function populateRow(cursor) {
    console.log(cursor.key)
    let purchase = cursor.value;
    let NUM_CELLS = 6 + 1;
    let table = document.getElementById('purchases');
    let row = document.createElement('tr');
    let pendingText = purchase.pending ? "Pending" : "Completed";

    let cells = []
    for (let i = 0; i < NUM_CELLS; i++)
        cells.push(document.createElement('td'));

    cells[0].innerHTML = purchase.email;
    cells[1].innerHTML = purchase.address;
    cells[3].innerHTML = purchase.tracking;
    cells[4].innerHTML = pendingText;
    
    console.log(purchase.bids);
    for (let i = 0; i < purchase.bids.length; i++) {
        cells[5].innerHTML += "$" + purchase.bids[i].bid + " by "+ 
        purchase.bids[i].company + "</br>"
    }

    let purchaseText = "";
    for (let i = 0; i < purchase.purchase.length; i++) {
        let current = purchase.purchase[i];
        purchaseText +=
            "Name: " + current.name + "</br>" + 
            "Price: $" + current.price + "</br>" + 
            "Quantity: " + current.quantity + "</br> </br>";
        cells[2].innerHTML = purchaseText;
    }

    let btn = createButton("Bid", bidOnPurchase, [cursor.key])
    cells[NUM_CELLS-1].appendChild(btn);

    for (let i = 0; i < NUM_CELLS; i++) 
        row.appendChild(cells[i]);
    table.appendChild(row);
}

function bidOnPurchase(purchaseKey) {
    let bidAmount = prompt("How much would you like to bid? Enter only a number (e.g. 5.50");
    console.log("The key is: ", purchaseKey);
    //let cursorIndex = IDBKeyRange.only(purchaseKey);
    let req = purchasesDB.transaction(PURCHASES_DB_NAME)
    .objectStore(PURCHASES_DB_NAME).get(purchaseKey);
    req.onsuccess = (e) => {
        let result = e.target.result;
        console.log(result.bids);
        if (result.bids) {
            console.log("Bids exist. Adding...");
            let arr = result.bids;
            arr.push(new Bid(username, bidAmount));
            purchasesDB.transaction(PURCHASES_DB_NAME, "readwrite")
            .objectStore(PURCHASES_DB_NAME).put({
                address: result.address,
                email: result.email,
                payment: result.payment,
                pending: result.pending,
                purchase: result.purchase,
                tracking: result.tracking,
                bids: arr
            }, purchaseKey)
            window.location.reload();
        } else {
            console.log("Bids do not exist. Creating bids array.")
            purchasesDB.transaction(PURCHASES_DB_NAME, "readwrite")
            .objectStore(PURCHASES_DB_NAME).put({
                address: result.address,
                email: result.email,
                payment: result.payment,
                pending: result.pending,
                purchase: result.purchase,
                tracking: result.tracking,
                bids: [new Bid(username, bidAmount)]
            }, purchaseKey)
            window.location.reload();
        } 
    }
}

function start() {
    /*
    let req = window.indexedDB.open(SYSTEMS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        console.log("Systems database loaded.");
        database = e.target.result;
    } */

    username = localStorage.getItem('username');
    let permission = +localStorage.getItem('permission');
    let req = window.indexedDB.open(PURCHASES_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        let tx = e.target.transaction;
        purchasesDB = e.target.result;
        console.log("Opened purchases DB");
        if (permission === DELIVERER) {
            console.log("Loading deliverer's stuff...")
            loadDeliverer();
        }
    }
    initializeNavigation();
    setupLoginButton();

    
}



function toggleTabs() {
    let availableTab = document.getElementById('available-tab');
    let availableDisplay = document.getElementById('available-display');
    let pendingTab = document.getElementById('pending-tab');
    let pendingDisplay = document.getElementById('pending-display');
    let approvedTab = document.getElementById('approved-tab');
    let approvedDisplay = document.getElementById('approved-display');

    let isAvailableSelected = availableTab.disabled;
    let isPendingSelected = pendingTab.disabled;
    let isApprovedSelected = approvedTab.disabled;

    if (isAvailableSelected & isPendingSelected & !isApprovedSelected) 
    {
        availableTab.disabled = false;
        pendingTab.disabled = true;
        approvedTab.disabled = true;
        availableDisplay.style.display = 'block';
        pendingDisplay.style.display = 'none';
        approvedDisplay.style.display = 'none';
    } 
    else if (!isAvailableSelected & isPendingSelected & isApprovedSelected)
    {
        availableTab.disabled = true;
        pendingTab.disabled = false;
        approvedTab.disabled = true;
        availableDisplay.style.display = 'none';
        pendingDisplay.style.display = 'block';
        approvedDisplay.style.display = 'none';
    }
    else if (isAvailableSelected & !isPendingSelected & isApprovedSelected)
    {
        availableTab.disabled = true;
        pendingTab.disabled = true;
        approvedTab.disabled = false;
        availableDisplay.style.display = 'none';
        pendingDisplay.style.display = 'none';
        approvedDisplay.style.display = 'block';
    }
}