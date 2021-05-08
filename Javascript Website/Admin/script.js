function suspendUser(cursor) {
    let verification = prompt("Are you sure you want to suspend this user? Enter in 'yes' to confirm.");
    if (verification === "yes") 
        console.log(cursor.email);
}

function loadUsers(db) {
    let tx = db.transaction(USERS_DB_NAME);
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
            suspendUser(cursorValue);
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
    let req = window.indexedDB.open(USERS_DB_NAME, VERSION);
    req.onsuccess = () => {
        console.log("Loaded database.");
        loadUsers(req.result);
    }
}