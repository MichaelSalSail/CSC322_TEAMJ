let database;
let purchasesDB; 
let username; 

function loadClerk() {
    document.getElementById('pending-container').style.display = 'none';
    document.getElementById('complete-container').style.display = 'none';
    let openCursor = purchasesDB.transaction(PURCHASES_DB_NAME)
    .objectStore(PURCHASES_DB_NAME).openCursor();
    openCursor.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
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
function confirmBid(name, purchase, key) {
    let bids = [];
    let selectedBid = 0;
    let index = 0;
    let radioButtons = document.getElementsByName(name);
    for (let i = 0; i < radioButtons.length; i++) {
        bids.push(radioButtons[i].value)
        if (radioButtons[i].checked) {
            selectedBid = radioButtons[i].value;
            index = i;
        }
    }

    if (selectedBid === 0) return; // clerk did not select anything

    let minimumBid = Math.min(...bids);
    if (selectedBid > minimumBid) { // clerk did not choose lowest, give alert
        let justification = prompt("You did not choose the lowest bid. Please reselect or justify your decision. Otherwise, this can result in a warning for your account.")
        if (justification.length === 0)
            warnClerk();
        else {
            updateUserPurchase(key, index);
            alert("You have confirmed this bid. The purchase is now being prepared for delivery.")
        }
    } else {
        updateUserPurchase(key, index);
        alert("You have confirmed this bid. The purchase is now being prepared for delivery.")
    }
    window.location.reload();
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

function updateUserPurchase(key, bidIndex) {
    let req = purchasesDB.transaction(PURCHASES_DB_NAME)
    .objectStore(PURCHASES_DB_NAME).get(key);
    req.onsuccess = (e) => {
        let result = e.target.result;
        console.log(result.bids)
        console.log(key)

        let trackingMsg = "This purchase is now being prepared for shipping by" + result.bids[bidIndex].company 
        purchasesDB.transaction(PURCHASES_DB_NAME, "readwrite")
        .objectStore(PURCHASES_DB_NAME).put({
            address: result.address,
            email: result.email,
            payment: result.payment,
            pending: false,
            purchase: result.purchase,
            tracking: trackingMsg,
            bids: result.bids[bidIndex]
        }, key)
        console.log("User's purchase has been updated.")
    }
}

function populateClerkRow(cursor) {
    console.log(cursor.value)
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

    let c = cursor;
    let btn = createButton("Choose Bid", confirmBid, [name, cursor.value, cursor.key]);
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
            if (cursor.value.pending)
                populateBidRow(cursor);
            else 
                populateTrackingRow(cursor);                
            cursor.continue();
        }
        else {
            console.log("There are no more purchases.")
        }
    }
}

function changeTrackingInfo(name, cursor) {
    let selectedIndex; 
    let buttons = document.getElementsByName(name);
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].checked) selectedIndex = i;
    }
    let trackingMessage = buttons[selectedIndex].value;
    console.log(trackingMessage);

    let req = purchasesDB.transaction(PURCHASES_DB_NAME)
    .objectStore(PURCHASES_DB_NAME).get(cursor);
    req.onsuccess = (e) => {
        let result = e.target.result;
        purchasesDB.transaction(PURCHASES_DB_NAME, "readwrite")
        .objectStore(PURCHASES_DB_NAME).put({
            address: result.address,
            email: result.email,
            payment: result.payment,
            pending: result.pending,
            purchase: result.purchase,
            tracking: trackingMessage,
            bids: result.bids
        }, cursor)
        console.log("User's tracking has been updated.")
        window.location.reload();
    }
}

function populateTrackingRow(cursor) {
    let table = document.getElementById('complete-purchases');
    console.log(cursor.key)
    let purchase = cursor.value;
    let NUM_CELLS = 6 + 1;
    let row = document.createElement('tr');
    let cells = []
    for (let i = 0; i < NUM_CELLS; i++)
        cells.push(document.createElement('td'));

    cells[0].innerHTML = purchase.email;
    cells[1].innerHTML = purchase.address;
    cells[3].innerHTML = "$" + purchase.bids.bid + " by </br>" + purchase.bids.company;
    cells[4].innerHTML = purchase.tracking;
    
    let purchaseText = "";
    for (let i = 0; i < purchase.purchase.length; i++) {
        let current = purchase.purchase[i];
        purchaseText +=
            "Name: " + current.name + "</br>" + 
            "Price: $" + current.price + "</br>" + 
            "Quantity: " + current.quantity + "</br> </br>";
        cells[2].innerHTML = purchaseText;
    }

    let trackingOptions = [
        "More than 50 miles away", "Within 50 miles", "Within 25 miles", "Within 10 miles",
        "Package delivered"
    ];
    let name = "tracking" + cursor.key;    
    for (let i = 0; i < trackingOptions.length; i++) {
        cells[5].appendChild(createRadioButton(name, trackingOptions[i], trackingOptions[i]))
    }

    for (let i  = 0; i < purchase.bids.length; i++) {
        let current = purchase.bids[i];
        cells[4].innerHTML += "$" + current.bid + " by "+ 
        current.company + "</br>"
    }
    let btn = createButton("Change Tracking", changeTrackingInfo, [name, cursor.key])
    cells[NUM_CELLS-1].appendChild(btn);
    
    for (let i = 0; i < NUM_CELLS; i++) 
        row.appendChild(cells[i]);
    table.appendChild(row);
}

function populateBidRow(cursor) {
    console.log(cursor.key)
    let purchase = cursor.value;
    let NUM_CELLS = 5 + 1;
    let table = document.getElementById('pending-purchases');
    let row = document.createElement('tr');

    let cells = []
    for (let i = 0; i < NUM_CELLS; i++)
        cells.push(document.createElement('td'));

    cells[0].innerHTML = purchase.email;
    cells[1].innerHTML = purchase.address;
    cells[3].innerHTML = purchase.tracking;
    
    console.log(purchase.bids);
    let purchaseText = "";
    for (let i = 0; i < purchase.purchase.length; i++) {
        let current = purchase.purchase[i];
        purchaseText +=
            "Name: " + current.name + "</br>" + 
            "Price: $" + current.price + "</br>" + 
            "Quantity: " + current.quantity + "</br> </br>";
        cells[2].innerHTML = purchaseText;
    }

    for (let i  = 0; i < purchase.bids.length; i++) {
        let current = purchase.bids[i];
        cells[4].innerHTML += "$" + current.bid + " by "+ 
        current.company + "</br>"
    }
    let btn = createButton("Bid", bidOnPurchase, [cursor.key])
    cells[NUM_CELLS-1].appendChild(btn);
    
    for (let i = 0; i < NUM_CELLS; i++) 
        row.appendChild(cells[i]);
    table.appendChild(row);
}

function bidOnPurchase(purchaseKey) {
    let bidAmount = prompt("How much would you like to bid? Enter only a number (e.g. 5.50)");
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
            document.getElementById('clerk-container').style.display = 'none';
            loadDeliverer();
        } else {
            console.log("Loading clerk's stuff...")
            loadClerk();
        }
    }
    initializeNavigation();
    setupLoginButton();
}