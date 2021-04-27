let DATABASE_NAME = "UserAccounts";
let VERSION = 6; // need to increment when we upgrade schema

// used for onload in html body
// initalize required variables here
function start() {
    let req = window.indexedDB.open(DATABASE_NAME, VERSION);
    req.onupgradeneeded = (e) => { 
        let version = e.oldVersion;
        console.log("Old version was", version);

        if (version < 6) {
            let db = req.result;
            db.deleteObjectStore(DATABASE_NAME);
            store = db.createObjectStore(DATABASE_NAME, {keyPath: "email"}),
            index = store.createIndex("email", "email", {unique: true});
        }
    }
    req.onerror = function(e) { 
        console.log("There was an error: " + e.target.errorCode);
    };
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
    let req = window.indexedDB.open(DATABASE_NAME, VERSION);

    if (isValidPassword(password, confirmPassword) && isValidEmail(email)) {
        console.log("Correct info");
        req.onsuccess = () => {
            db = req.result; // setting variables to work with
            tx = db.transaction(DATABASE_NAME, "readwrite");
            store = tx.objectStore(DATABASE_NAME);
            store.put({
                email: email,
                username: username,
                password: password
            });
            
            tx.oncomplete = () => {
                console.log("User successfully registered.");
                db.close();
            };
        };
    }
    else { // throw text errors
        document.getElementById('validity-check').innerHTML = "Please recheck your information.";
    }
}

// query database for corresponding email + password
function signInUser(){
    let email = document.getElementById('log-email').value;
    let password = document.getElementById('log-password').value;
    let getDB = window.indexedDB.open(DATABASE_NAME, VERSION);
    getDB.onsuccess = () => { // process login
        let results = getDB.result;
        let transaction = results.transaction(DATABASE_NAME, "readonly");
        let store = transaction.objectStore(DATABASE_NAME);
        let req = store.get(email);
        req.onsuccess = (e) => {
            let table = e.target.result;
            if (table && table.email === email && table.password === password) { // check if not undefined and info matches from DB
                console.log("Successful login.");
                // TODO: GO TO HOME PAGE
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

function parseForm() {
    let isRegistering = document.getElementById('register-tab').disabled;
    if (isRegistering) 
        registerUser();
    else
        signInUser();    
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