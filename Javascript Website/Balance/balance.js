
let users;

function addBalance() {
    let cardNum = document.getElementById("credit-card").value;
    let addedBalance = parseInt(document.getElementById("add-balance").value);
    if (!addedBalance) {
        alert("Enter a number for the balance.")
        return;
    }
    let newBalance = addedBalance + parseInt(localStorage.getItem("balance"));
    if (document.querySelector("#error_message3").textContent=='Good' && document.getElementById("add-balance").value.length!=0) {
        let email = window.localStorage.getItem("email");
        updateCurrentUserBalance(users, newBalance, email);
        localStorage.setItem("balance", newBalance+"");
        alert("Your funds have been added. Please refresh to see the changes.")
    } 
    else if(document.querySelector("#error_message3").textContent!=='Good') { 
        alert("Invalid Credit Card.")
    }
    else
    {
        alert("Properly fill in the required fields.")
    }
}

function initializeRewards() {
    let email = localStorage.getItem("email");
    let cursorIndex = IDBKeyRange.only(email);
    let req = users.transaction(USERS_DB_NAME)
        .objectStore(USERS_DB_NAME).openCursor(cursorIndex);
    req.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor){
            document.getElementById("rewards").innerHTML +=
            cursor.value.rewards + " rewards points.";
        }
    }
}

function cashInRewardsPoints(rewards) {
    let currentRewards = parseInt(localStorage.getItem("rewards"));
    if (currentRewards < rewards) {
        alert("You do not have enough rewards points to do this.");
        return;
    }

    let email = localStorage.getItem("email");
    let cursorIndex = IDBKeyRange.only(email);
    let tx = users.transaction(USERS_DB_NAME, "readwrite");
    let store = tx.objectStore(USERS_DB_NAME)
    let req = store.openCursor(cursorIndex);
    req.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor){
            console.log(cursor.value);
            let table = cursor.value;
            let req = store.put({
                email: table.email,
                username: table.username,
                password: table.password,
                balance: table.balance + rewards,
                rewards: table.rewards - rewards,
                permission: table.permission,
                warning: table.warning
            });
            cursor.continue();
        } else {
            alert("You have successfully cashed in " + rewards + " rewards points. Please refresh to see your changes.")
            let balance = parseInt(localStorage.getItem("balance"))
            let currRewards = parseInt(localStorage.getItem("rewards"))
            localStorage.setItem("balance", (balance + rewards)+'');
            localStorage.setItem("rewards", currRewards - rewards);
        }
    }
}

function start() {
    let balance = localStorage.getItem("balance");
    let rewards = localStorage.getItem("rewards");
    document.getElementById("curr-balance").innerHTML += balance + " points.";
    document.getElementById("rewards").innerHTML += rewards + " rewards points.";

    form3 = document.querySelector("#fifth");//querySelector("form")
    output3 = document.querySelector("#error_message3");
    form3.addEventListener("input", () => {
      let zip = form3.elements.Credit.value;
      let isInteger = /^\+?(0|[1-9]\d*)$/.test(zip);
      if(zip.length == 16 && isInteger)
      {
        output3.textContent = "Good";
      }
      else
      {
        output3.textContent = "A Credit Card # must be 16 digits";
      }
    });
    
    let req = window.indexedDB.open(USERS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        users = e.target.result;
    }

    req.onerror = (e) => console.log("There was an error: " + e.target.errorCode);
    setupLoginButton();
    initializeNavigation();
}