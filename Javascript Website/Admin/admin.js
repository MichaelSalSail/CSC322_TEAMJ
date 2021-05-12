let users;
let avoidList;
let components;


// need to remove components from the database when suspending a manufacturer
function suspendManufacturer(user) {
    let manufacturer = user.username;
    let tx = components.transaction(COMPONENTS_DB_NAME, "readwrite");
    let store = tx.objectStore(COMPONENTS_DB_NAME);
    let index = store.index("manufacturer");
    let cursorReq = index.openKeyCursor(manufacturer);
    cursorReq.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            store.delete(cursor.primaryKey);
            console.log("Deleted component.")
            cursor.continue();
        }
    }
    suspendUser(users, user);
}

function loadUsers() {
    let tx = users.transaction(USERS_DB_NAME);
    let store = tx.objectStore(USERS_DB_NAME);
    let usersTable = document.getElementById("user-table");
    let list = store.openCursor();
    list.onsuccess = () => { 
        let cursor = list.result;
        if (!cursor) return; 
        let cursorValue = cursor.value;
        let cellValues = [
            cursorValue.email, cursorValue.username, cursorValue.password,
            cursorValue.permission, cursorValue.balance, 
            cursorValue.rewards, cursorValue.warning];

        let row = document.createElement('tr');
        usersTable.appendChild(row);

        let btn = document.createElement('button');
        btn.innerHTML = "Suspend";
        btn.setAttribute("style","width:50px;");
        btn.setAttribute("style","height:50px;");
        btn.addEventListener('click', () => {
            let verification;
            switch (cursorValue.permission) {
                case MANU:
                    verification = prompt("Are you sure you want to suspend this user? Enter in 'yes' to confirm.");
                    if (verification === "yes")  
                        suspendManufacturer(cursorValue);
                    window.location.reload();
                    break;
                case ADMIN:
                    alert("Cannot suspend this privilege level.");
                    break;
                default:
                    verification = prompt("Are you sure you want to suspend this user? Enter in 'yes' to confirm.");
                    if (verification === "yes")  
                        suspendUser(users, cursorValue);
                    window.location.reload();
                    break;
            }
        });

        for (let i = 0; i < cellValues.length; i++){
            let cell = document.createElement('td');
            cell.innerHTML = cellValues[i];
            row.appendChild(cell);
        }

        row.appendChild(document.createElement('td').appendChild(btn));
        cursor.continue();
    }
}

function start() {
    initializeNavigation();

    let req = window.indexedDB.open(AVOID_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        console.log("Avoid list database loaded.")
        avoidList = e.target.result;
    }

    req = window.indexedDB.open(USERS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        users = e.target.result;
        console.log("Loaded users database.");
        loadUsers();
    }

    req = window.indexedDB.open(COMPONENTS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        components = e.target.result;
        console.log("Loaded components database.");
    }
}