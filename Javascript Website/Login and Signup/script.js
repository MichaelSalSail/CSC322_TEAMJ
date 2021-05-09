/* PERMISSION LEVELS:
0 = VISITOR
1 = USER
2 = DELIVERER
3 = MANU
4 = CLERK
5 = ADMIN */

let avoidList;

function start() {
    let req = window.indexedDB.open(USERS_DB_NAME, VERSION);
    req.onsuccess = () => console.log("Loaded database.");
    req.onupgradeneeded = (e) => { 
        let db = req.result;
        let version = e.oldVersion;
        let tx = req.transaction;
        console.log("Old version was", version);

        if (version == 0) {
            store = db.createObjectStore(USERS_DB_NAME, {keyPath: "email"}),
            index = store.createIndex("email", "email", {unique: true});

            tx.oncomplete = () => {
                initializeSuperusers(db);
            };
        }
    }
    req.onerror = function(e) { 
        console.log("There was an error: " + e.target.errorCode);
    };

    req = window.indexedDB.open(AVOID_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        console.log("Avoid list database opened.")
        avoidList = e.target.result;
    }

    req.onupgradeneeded = (e) => {
        let db = e.target.result;
        let version = e.oldVersion;
        console.log("Old version was", version);
        if (version == 0) {
            store = db.createObjectStore(AVOID_DB_NAME, {keyPath: "email"}),
            index = store.createIndex("email", "email", {unique: true});
            console.log("Avoid list created.");
        }
    } 
}

/* only called when the database is set up for first time
creates an admin, a clerk, and two deliverers for use later */
function initializeSuperusers(db) {
    tx = db.transaction(USERS_DB_NAME, "readwrite");
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
    let req = window.indexedDB.open(USERS_DB_NAME, VERSION);

    if (isValidPassword(password, confirmPassword) && isValidEmail(email)) {
        console.log("Correct info");
        req.onsuccess = () => {
            db = req.result; // setting variables to work with
            tx = db.transaction(USERS_DB_NAME, "readwrite");
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
                db.close();
            };
        };
    }
    else { // throw text errors
        document.getElementById('validity-check').innerHTML = "Please recheck your information.";
    }
}


function isOnAvoidList() {
    let email = document.getElementById('log-email').value;
    avoidList.transaction(AVOID_DB_NAME).objectStore(AVOID_DB_NAME)
        .openCursor(email).onsuccess = (e) => {
            let cursor = e.target.result;
            if (cursor) { 
                alert("You have been suspended. Check your email for details.");
                return;
            }
        };
}

function foo(){ 
    isOnAvoidList().then(()=>console.log('a')).catch(()=>console.log('b'));
    return;
    let isSuspended = () => {
        isOnAvoidList().then((res) => {
        return res;
        }).catch(() => {
            return false;
        })
    };

    console.log(isSuspended);
}

function checkUserCredentials(email, password) {
    let getDB = window.indexedDB.open(USERS_DB_NAME, VERSION);
    getDB.onsuccess = () => { // process login
        let results = getDB.result;
        let transaction = results.transaction(USERS_DB_NAME, "readonly");
        let store = transaction.objectStore(USERS_DB_NAME);
        let req = store.get(email);
        req.onsuccess = (e) => {
            let table = e.target.result;
            if (table && table.email === email && table.password === password) { // check if not undefined and info matches from DB
                console.log("Successful login.");
                console.log("Current user's permission is", table.permission);
                window.location.href = "../Welcome/welcome.html";
                window.localStorage.setItem("permission", (table.permission).toString());
                window.localStorage.setItem("username", table.username);
                window.localStorage.setItem("email", table.email);
                window.localStorage.setItem("balance", table.balance);
                window.location.href = '../Welcome/welcome.html';
            }
            else 
                console.log("Username not found or password is incorrect");
        }
        req.onerror = () => console.log(req.error);
        transaction.oncomplete = () => console.log("Transaction complete.");
        transaction.onerror = () => console.log("Transaction failed.")
    };
    getDB.onerror = () => console.log("Could not open database:", getDB.error);
}
// query database for corresponding email + password
function signInUser(){
    let email = document.getElementById('log-email').value;
    let password = document.getElementById('log-password').value;

    avoidList.transaction(AVOID_DB_NAME).objectStore(AVOID_DB_NAME)
        .openCursor(email).onsuccess = (e) => {
            let cursor = e.target.result;
            if (cursor) { 
                alert("You have been suspended. Check your email for details.");
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