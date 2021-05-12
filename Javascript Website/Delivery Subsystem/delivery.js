let database;
let purchasesDB; 
let username; 

function loadClerk() {
    document.getElementById('deliv-purchases').style.display = 'none';
    let openCursor = purchasesDB.transaction(PURCHASES_DB_NAME)
    .objectStore(PURCHASES_DB_NAME).openCursor();
    openCursor.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            //console.log(cursor.key);
            //console.log(cursor.value);
            if (cursor.value.pending) {
                console.log(cursor.value);
                populateClerkRow(cursor);
            }
            cursor.continue();
        }
        else {
            console.log("There are no more purchases.")
        }
    }
}

function createRadioButton(name, value, text) {
    let label = document.createElement("label");
    let radio = document.createElement("input");
    radio.name = name;
    radio.type = "radio";
    radio.value = value;
    console.log("Radio button's name:", name);
    label.appendChild(radio);
    label.appendChild(document.createTextNode(text));

    return label;
  }

// needs the name of the radio button
function confirmBid(name, purchase) {
    let bids = [];
    let selectedBid = 0;
    let radioButtons = document.getElementsByName(name);
    for (let i = 0; i < radioButtons.length; i++) {
        bids.push(radioButtons[i].value)
        if (radioButtons[i].checked) 
            selectedBid = radioButtons[i].value;
    }

    if (selectedBid === 0) return; // clerk did not select anything

    let minimumBid = Math.min(...bids);
    if (selectedBid > minimumBid) { // clerk did not choose lowest, give alert
        let justification = prompt("You did not choose the lowest bid. Please reselect or justify your decision. Otherwise, this can result in a warning for your account.")
        if (justification.length === 0)
            warnClerk();
        else {
            updateUserPurchase(purchase);
            alert("You have confirmed this bid. The purchase is now being prepared for delivery.")
        }
    } else {
        updateUserPurchase(purchase);
        alert("You have confirmed this bid. The purchase is now being prepared for delivery.")
    }
}   

function warnClerk() {
    alert("Suspicious behavior detected. You have been assigned a warning and this action will be reviewed.")
    let req = window.indexedDB.open(USERS_DB_NAME, VERSION);
    req.onsuccess = (e) => { // access clerk and update warning count
        let email = localStorage.getItem("email")
        let db = e.target.result;
        let store = db.transaction(USERS_DB_NAME, "readwrite").objectStore(USERS_DB_NAME);
        let getClerk = store.get(email);
        getClerk.onsuccess = (e) => {
            clerk = e.target.result;
            if (clerk.warning + 1 === 3) {// suspension
                suspendUser(db, clerk);
                alert("This has been your third warning. You have been suspended.");
                window.location.href = "../Login and Signup/index.html";
            }
            else {
                store.put({
                    email: clerk.email,
                    username: clerk.username,
                    password: clerk.password,
                    permission: clerk.permission,
                    rewards: clerk.rewards,
                    balance: clerk.balance,
                    warning: clerk.warning + 1
                })
            }
        }
    }

}

function updateUserPurchase(key) {
    let req = purchasesDB.transaction(PURCHASES_DB_NAME)
    .objectStore(PURCHASES_DB_NAME).get(key);
    req.onsuccess = (e) => {
        let result = e.target.result;
        purchasesDB.transaction(PURCHASES_DB_NAME, "readwrite")
        .objectStore(PURCHASES_DB_NAME).put({
            address: result.address,
            email: result.email,
            payment: result.payment,
            pending: false,
            purchase: result.purchase,
            tracking: "This purchase is now being prepared for shipping.",
            bids: result.bids
        }, key)
        console.log("User's purchase has been updated.")
    }
}

function populateClerkRow(cursor) {
    let table = document.getElementById('clerk-purchases');
    let purchase = cursor.value;
    let NUM_CELLS = 3 + 1;
    let row = document.createElement('tr');
    let pendingText = purchase.pending ? "Pending" : "Completed";

    let cells = []
    for (let i = 0; i < NUM_CELLS; i++)
        cells.push(document.createElement('td'));

    cells[0].innerHTML = purchase.email;
    cells[2].innerHTML = pendingText;
    
    let name = "bids"+ cursor.key;
    // create radio buttons for each bid so clerk can choose
    for (let i = 0; i < purchase.bids.length; i++) {
        let currentBid = purchase.bids[i];
        let label = currentBid.bid;
        cells[1].appendChild(createRadioButton(name, currentBid.bid, label))
    }

    let btn = createButton("Choose Bid", confirmBid, [name, cursor.key]);
    cells[3].appendChild(btn);

    for (let i = 0; i < NUM_CELLS; i++) row.appendChild(cells[i]);
    table.appendChild(row);
}

function loadDeliverer() {
    let openCursor = purchasesDB.transaction(PURCHASES_DB_NAME)
    .objectStore(PURCHASES_DB_NAME).openCursor();
    openCursor.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            populateDelivererRow(cursor);
            cursor.continue();
        }
        else {
            console.log("There are no more purchases.")
        }
    }
}

function populateDelivererRow(cursor) {
    console.log(cursor.key)
    let purchase = cursor.value;
    let NUM_CELLS = 6 + 1;
    let table = document.getElementById('deliv-purchases');
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
    let req = purchasesDB.transaction(PURCHASES_DB_NAME)
    .objectStore(PURCHASES_DB_NAME).get(purchaseKey);
    req.onsuccess = (e) => {
        let result = e.target.result;
        console.log(result.bids);
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
        if (permission === ADMIN) {
            loadDeliverer();
            loadClerk();
        }
        else if (permission === DELIVERER) {
            console.log("Loading deliverer's stuff...")
            document.getElementById('clerk-purchases').style.display = 'none';
            loadDeliverer();
        } else {
            console.log("Loading clerk's stuff...")
            document.getElementById('deliv-purchases').style.display = 'none';
            loadClerk();
        }
    }
    initializeNavigation();
    setupLoginButton();

    
}


/*
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
}*/