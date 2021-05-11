let users;
let avoidList;

function addToAvoidList(user) {
    tx = avoidList.transaction(AVOID_DB_NAME, "readwrite");
    store = tx.objectStore(AVOID_DB_NAME);
    store.put({
        email: user.email,
        username: user.username,
        password: user.password
    });
    console.log(user.email, "has been added to the avoid list.");
}

// need to remove components from the database when suspending a manufacturer
function suspendManufacturer(user) {

}

function suspendUser(user) {
    let verification = prompt("Are you sure you want to suspend this user? Enter in 'yes' to confirm.");
    if (verification === "yes")  {
        let req = users.transaction(USERS_DB_NAME, 'readwrite')
        .objectStore(USERS_DB_NAME).delete(user.email);
        req.onsuccess = () => {
            console.log(user.email, "has been deleted from the database."); 
            addToAvoidList(user);
        }
    }
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
            switch (cursorValue.permission) {
                case MANU:
                    suspendManufacturer(cursorValue);
                    break;
                case ADMIN:
                    alert("Cannot suspend this privilege level.");
                    break;
                default:
                    suspendUser(cursorValue);
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
    req.onsuccess = () => {
        users = req.result;
        console.log("Loaded users database.");
        loadUsers();
    }
}