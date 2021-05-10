let users;

function isValidCreditCard(creditCardNum) {
    let randomizer = Math.round(Math.random()*100+1); // 5% chance that the card gets declined
    return creditCardNum.length === 16 && randomizer < 95;
}

function addBalance() {
    let cardNum = document.getElementById("credit-card").value;
    let addedBalance = parseInt(document.getElementById("add-balance").value);
    let newBalance = addedBalance + parseInt(localStorage.getItem("balance"));
    if (isValidCreditCard(cardNum)) {
        let email = window.localStorage.getItem("email");
        updateCurrentUserBalance(users, newBalance, email);
        localStorage.setItem("balance", newBalance+"");
        alert("Your funds have been added. Please refresh to see the changes.")
    } else { 
        alert("Your credit card either does not have sufficient funds or has been rejected.")
    }
}

function start() {
    initializeNavigation();
    let balance = localStorage.getItem("balance");
    document.getElementById("curr-balance").innerHTML += balance + " points.";

    let req = window.indexedDB.open(USERS_DB_NAME, VERSION);
    req.onsuccess = (e) => users = e.target.result;
    req.onerror = (e) => console.log("There was an error: " + e.target.errorCode);
}