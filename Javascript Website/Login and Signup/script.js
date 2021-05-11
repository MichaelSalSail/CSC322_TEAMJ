/* PERMISSION LEVELS:
0 = VISITOR
1 = USER
2 = DELIVERER
3 = MANU
4 = CLERK
5 = ADMIN */

let avoidList;
let users;

function start() {
    let req = window.indexedDB.open(USERS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        console.log("Users database opened.")
        users = e.target.result;
        console.log(users);
        initializeSuperusers();
    }
    req.onupgradeneeded = (e) => {  
        let store = e.target.result.createObjectStore(USERS_DB_NAME, {keyPath: "email"});
        store.createIndex("email", "email", {unique: true});
        store.createIndex("username", "username", {unique: true});
    }
    req.onerror = (e) => console.log("There was an error: " + e.target.errorCode);

    req = window.indexedDB.open(AVOID_DB_NAME, VERSION);
    req.onsuccess = (e) => avoidList = e.target.result;
    req.onupgradeneeded = (e) => {
        let store = e.target.result.createObjectStore(AVOID_DB_NAME, {autoIncrement: true});
        store.createIndex("email", "email", {unique: true});
    }
}

/* only called when the database is set up for first time
creates an admin, a clerk, and two deliverers for use later */
function initializeSuperusers() {
    tx = users.transaction(USERS_DB_NAME, "readwrite");
    store = tx.objectStore(USERS_DB_NAME);

    for (let i = 0; i < SUPERUSERS.length; i++){
        store.put({
            email: SUPERUSERS[i][0],
            username: SUPERUSERS[i][1],
            password: SUPERUSERS[i][2],
            permission: SUPERUSERS[i][3],
            balance: SUPERUSERS[i][4],
            rewards: SUPERUSERS[i][5],
            warning: SUPERUSERS[i][6]
        });
    }
}

// will return true if the email:
// 1. contains the @ character
// 2. there is something before and after the @ character
function isValidEmail(email) {
    let index = email.indexOf('@');
    return index != -1 && (email.charAt(index+1) != '' && email.charAt(index-1) != '');
}

// our conditions are:
// 1. passwords have a minimum of 6 characters
// 2. both password and the confirmed password are the same
function isValidPassword(password, confirmPassword) {
    return password.length >= 6 && password === confirmPassword;
}

// checks that information is valid first
// then will proceed to database and check if email exists
// if not, add info as new table in store
function registerUser() {
    let username = document.getElementById('username').value;
    let email = document.getElementById('reg-email').value;
    let password = document.getElementById('reg-password').value;
    let confirmPassword = document.getElementById('confirm-password').value
    if (isValidPassword(password, confirmPassword) && isValidEmail(email)) {
        console.log("Correct info");
        tx = users.transaction(USERS_DB_NAME, "readwrite");
        store = tx.objectStore(USERS_DB_NAME);
        store.put({
            email: email,
            username: username,
            password: password,
            permission: 1, // all registered users are 'user' by default 
            balance: 500,
            rewards: 0,
            warning: 0
        });
        
        tx.oncomplete = () => {
            alert("Registration complete! Please login with your information.")
            console.log("User successfully registered.");
        };
    }
    else { // throw text errors
        document.getElementById('validity-check').innerHTML = "Please recheck your information.";
    }
}

function checkUserCredentials(email, password) {
    let transaction = users.transaction(USERS_DB_NAME);
    let store = transaction.objectStore(USERS_DB_NAME);
    let req = store.get(email);
    req.onsuccess = (e) => {
        let table = e.target.result;
        console.log(table)
        if (table && table.email === email && table.password === password) { // check if not undefined and info matches from DB
            console.log("Successful login.");
            console.log("Current user's permission is", table.permission);
            window.location.href = "../Welcome/welcome.html";
            window.localStorage.setItem("permission", (table.permission).toString());
            window.localStorage.setItem("username", table.username);
            window.localStorage.setItem("email", table.email);
            window.localStorage.setItem("balance", table.balance);
            window.localStorage.setItem("rewards", table.rewards);
            window.location.href = '../Welcome/welcome.html';
        }
        else 
            console.log("Username not found or password is incorrect");
    }
}
// query database for corresponding email + password
function signInUser(){
    let email = document.getElementById('log-email').value;
    let password = document.getElementById('log-password').value;
    console.log(email, password);

    avoidList.transaction(AVOID_DB_NAME).objectStore(AVOID_DB_NAME)
    .openCursor(email).onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) { 
            alert("You have been suspended. Check your email for details.");
            window.location.href = "../suspended_index.html";
            return;
        } else {
            checkUserCredentials(email, password);
        }
    };
}

function parseForm() {
    let isRegistering = document.getElementById('register-tab').disabled;
    if (isRegistering) 
        registerUser();
    else
        signInUser();    
}

function continueAsVisitor() {
    console.log("User is a visitor.");
    window.location.href="../Welcome/welcome.html";
    window.localStorage.setItem("permission", "0");
    window.localStorage.setItem("username", "Guest");
}

// login button is disabled by default since it is the default tab
// checks which is selected and then toggles the button disable state
// changes style of each display to visible/none depending if the tab is selected
function toggleTabs() {
    let loginTab = document.getElementById('login-tab');
    let loginDisplay = document.getElementById('login-display');
    let registerTab = document.getElementById('register-tab');
    let registerDisplay = document.getElementById('register-display');

    let isLoginSelected = loginTab.disabled;

    if (isLoginSelected) {
        loginTab.disabled = false;
        registerTab.disabled = true;
        loginDisplay.style.display = 'none';
        registerDisplay.style.display = 'block';
    } else {
        loginTab.disabled = true;
        registerTab.disabled = false;
        loginDisplay.style.display = 'block';
        registerDisplay.style.display = 'none';
    }
}