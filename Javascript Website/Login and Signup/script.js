/* PERMISSION LEVELS:
0 = VISITOR
1 = USER
2 = DELIVERER
3 = MANU
4 = CLERK
5 = ADMIN */

let avoidList;
let users;

const POST1 = "The iMac Pro is a great product and I do not regret purchasing it at all! I would recommend this to anyone with 5 thousand dollars lying around.";
const POST2 = "If you're looking for the best gaming CPU or the best CPU for workstations, there are only two choices to pick from – AMD and Intel. That fact has spawned an almost religious following for both camps, and the resulting flamewars, that make it tricky to get unbiased advice about the best choice for your next processor. But in many cases, the answer is actually very clear. In fact, for most users, it's a blowout win in AMD's favor"
// forum constant threads 
const THREADS = [["admin", "iMac Review", "Product Review", [new Post("admin", POST1)]],
    ["AMD", "Why you should buy AMD over Intel", "Computer Discussion", [new Post("Intel", POST2)]]];

// create ALL databases that are used later 
// except systems since that is done in welcome, which is directly after the login
function start() {
    let req = window.indexedDB.open(USERS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        console.log("Users database opened.")
        users = e.target.result;
        console.log(users);
    }
    req.onupgradeneeded = (e) => {
        let tx = e.target.transaction;
        let store = e.target.result.createObjectStore(USERS_DB_NAME, {keyPath: "email"});
        store.createIndex("email", "email", {unique: true});
        store.createIndex("username", "username", {unique: true});
        tx.oncomplete = () => {
            users = e.target.result
            console.log("Created users DB.");
            initializeSuperusers();
            console.log("Default users initialized.");
        }
    }
    req.onerror = (e) => console.log("There was an error: " + e.target.errorCode);

    let avoidreq = window.indexedDB.open(AVOID_DB_NAME, VERSION);
    avoidreq.onsuccess = (e) => {
        avoidList = e.target.result;
        console.log("Avoid list DB opened.")
    }
    avoidreq.onupgradeneeded = (e) => {
        let store = e.target.result.createObjectStore(AVOID_DB_NAME, {keyPath: "email"});
        store.createIndex("email", "email", {unique: true});
        console.log("Created avoid list DB.")
    }

    let purchasesReq = window.indexedDB.open(PURCHASES_DB_NAME, VERSION);
    purchasesReq.onupgradeneeded = (e) => {
            let tx = purchasesReq.transaction;
            let store = e.target.result.createObjectStore(PURCHASES_DB_NAME, {autoIncrement: true});
            store.createIndex("email", "email", {unique: false});
            tx.oncomplete = (e) => {
            console.log("Created purchases DB.")
            purchases = e.target.result;
        }
    }

    let dbreq = window.indexedDB.open(COMPONENTS_DB_NAME, VERSION);
    dbreq.onsuccess = () => {
        console.log("Components DB opened.");
        
    }
    dbreq.onupgradeneeded = (e) => {
        let store = e.target.result.createObjectStore(COMPONENTS_DB_NAME, {keyPath: "name"});
        store.createIndex("name", "name", {unique: true});
        store.createIndex("manufacturer", "manufacturer", {unique: false});
        console.log("Created components DB.");
        e.target.transaction.oncomplete = () => initializeComponents(e.target.result);

    }

    let forumreq = window.indexedDB.open(FORUMS_DB_NAME, VERSION);
    forumreq.onsuccess = () => {
        console.log("Forums DB opened.");
    }
    forumreq.onupgradeneeded = (e) => {
        let db = e.target.result;
        let store = db.createObjectStore(FORUMS_DB_NAME, {autoIncrement: true});
        store.createIndex("author", "author", {unique: false});
        e.target.transaction.oncomplete = () => {
            users = e.target.result
            console.log("Created forum DB.");
            initializeThreads(db);
            console.log("Default threads initialized.");
        }
    }
}

function initializeThreads(db) {
    tx = db.transaction(FORUMS_DB_NAME, "readwrite");
    store = tx.objectStore(FORUMS_DB_NAME);
    for (let i = 0; i < THREADS.length; i++) {
        store.put({
            author: THREADS[i][0],
            title: THREADS[i][1],
            type: THREADS[i][2],
            posts: THREADS[i][3]
        })
    }
}


// attr: "name", "description", "price", "manufacturer", "type"
// traverses 3D array to add component attributes to database
function initializeComponents(db) {
    tx = db.transaction(COMPONENTS_DB_NAME, "readwrite");
    store = tx.objectStore(COMPONENTS_DB_NAME);
    for (let outer = 0; outer < COMPONENTS.length; outer++) {
        for (let i = 0; i < COMPONENTS[0].length; i++) {
            store.put({
                name: COMPONENTS[outer][i][0],
                description: COMPONENTS[outer][i][1],
                price: COMPONENTS[outer][i][2],
                manufacturer: COMPONENTS[outer][i][3],
                type: COMPONENTS[outer][i][4]
            });
        }
    }
    
    tx.oncomplete = () => {
        console.log("Components loaded.");
    };
}

/* only called when the database is set up for first time
creates an admin, a clerk, a dummy user, and two deliverers for use later */
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

    avoidList.transaction(AVOID_DB_NAME).objectStore(AVOID_DB_NAME)
    .get(email).onsuccess = (e) => {
        let res = e.target.result;
        if (res) { 
            alert("You have been suspended. Check your email for details.");
            window.location.href = "../Simple Pages/suspended_index.html";
            return;
        } else {
            let transaction = users.transaction(USERS_DB_NAME);
            let store = transaction.objectStore(USERS_DB_NAME);
            let req_a = store.get(email);
            req_a.onsuccess = (e) => {
                let table = e.target.result;
                if(table && table.email === email)
                {
                    document.getElementById('error_loginsignup_b').innerHTML='Email taken';
                    document.getElementById('error_loginsignup_b').style.color='red';
                    return;
                }
            }
            if(username.length < 1)
            {
                document.getElementById('error_loginsignup_b').innerHTML='Please fill in a username';
                document.getElementById('error_loginsignup_b').style.color='red';
            }
            else if(email.length < 1)
            {
                document.getElementById('error_loginsignup_b').innerHTML='Please fill in a email';
                document.getElementById('error_loginsignup_b').style.color='red';
            }
            else if(email.indexOf('@')===-1)
            {
                document.getElementById('error_loginsignup_b').innerHTML='Invalid email';
                document.getElementById('error_loginsignup_b').style.color='red';
            }
            else if(password.length < 1)
            {
                document.getElementById('error_loginsignup_b').innerHTML='Please fill in a password';
                document.getElementById('error_loginsignup_b').style.color='red';
            }
            else if(password.length < 6)
            {
                document.getElementById('error_loginsignup_b').innerHTML='Please choose a stronger password';
                document.getElementById('error_loginsignup_b').style.color='red';
            }
            else if(confirmPassword.length < 1)
            {
                document.getElementById('error_loginsignup_b').innerHTML='Please confirm your password';
                document.getElementById('error_loginsignup_b').style.color='red';
            }
            else if(password!==confirmPassword)
            {
                document.getElementById('error_loginsignup_b').innerHTML='Passwords don\'t match';
            }
            else if (isValidPassword(password, confirmPassword) && isValidEmail(email) && document.getElementById('error_loginsignup_b').innerHTML!=='Email taken') {
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
                    console.log("Registration successful.");
                    document.getElementById('error_loginsignup_b').innerHTML='Registration successful';
                    document.getElementById('error_loginsignup_b').style.color='black';
                };
            }
        }
    };  
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
        {
            console.log("Invalid email or password");
            document.getElementById('error_loginsignup_a').innerHTML='Invalid email or password';
            document.getElementById('error_loginsignup_a').style.color='red';
        } 
    }
}
// query database for corresponding email + password
function signInUser(){
    let email = document.getElementById('log-email').value;
    let password = document.getElementById('log-password').value;
    console.log(email, password);

    avoidList.transaction(AVOID_DB_NAME).objectStore(AVOID_DB_NAME)
    .get(email).onsuccess = (e) => {
        let res = e.target.result;
        if (res) { 
            alert("You have been suspended. Check your email for details.");
            window.location.href = "../Simple Pages/suspended_index.html";
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

    document.getElementById('error_loginsignup_a').innerHTML='[CONSOLE OUTPUT]';
    document.getElementById('error_loginsignup_a').style.color='black';
    document.getElementById('error_loginsignup_b').innerHTML='[CONSOLE OUTPUT]';
    document.getElementById('error_loginsignup_b').style.color='black';

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