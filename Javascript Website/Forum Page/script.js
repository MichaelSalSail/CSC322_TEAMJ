// Database Constants
const DATABASE_NAME = FORUMS_DB_NAME;
let thread;

class Post {
    constructor(id, author, message){
        this.id;
        this.author;
        this.message;
    }
}

const THREADS = [
    [1, "Daniel", "Hello PC Emporium!", [new Post("1", "Daniel", "Hello PC Emporium"), new Post("2", "Dan", "Hello PC Emporium")]]
    //[2, "Dan", "PC Prices?", [[3, "Dan", "Where can I see prices for built systems?"]]],
    //[3, "Michael", "Concerns About GPU Shortage", []]
];


// traverses 3D array to add component attributes to database
function initializeComponents(db) {
    tx = db.transaction(DATABASE_NAME, "readwrite");
    store = tx.objectStore(DATABASE_NAME);
    for(let i=0; i<THREADS.length; i++) {
    store.put({
                id: THREADS[i][0],
                author: THREADS[i][1],
                title: THREADS[i][2],
                posts: THREADS[i][3]
        });
    }
    
    tx.oncomplete = () => {
        console.log("Threads loaded.");
        db.close();
    };
}

function populateRow(table, cursorValue) {
    const NUMBER_OF_CELLS = 4;
    let cells = [];
    let row = document.createElement('tr');
    table.appendChild(row);
    for (let i = 0; i < NUMBER_OF_CELLS; i++){
        let cell = document.createElement('td');
        cells.push(cell);
    };

    cells[0].innerHTML = cursorValue.id;
    cells[1].innerHTML = cursorValue.author;
    cells[2].innerHTML = cursorValue.title;

    for (let i = 0; i < cells.length; i++) row.appendChild(cells[i]);

    let btn = document.createElement('button');
    btn.innerHTML = "View Thread";
    btn.addEventListener('click', () => {
        viewThread(cursorValue);
    });

    cells[3].appendChild(btn); // add to cart
}

function viewThread(cursorValue) {
    let getDB = window.indexedDB.open(DATABASE_NAME, VERSION);
    getDB.onsuccess = () => {
        let results = getDB.result;
        let transaction = results.transaction(DATABASE_NAME, "readonly");
        let store = transaction.objectStore(DATABASE_NAME);
        let req = store.get(1);
        console.log(req);

        req.onsuccess = (e) => {
            let table = e.target.result;
            console.log(table);
        }
    }
    // req.onsuccess = (e) => {
    //     let table = e.target.result;
    //     window.localStorage.setItem("threadId", table.id);
    // }
    // console.log("Successfully added to cart.");
    // alert("Added to cart.")
}

function createThread() {
    let transaction = db.transaction(DATABASE_NAME);
    let tables = transaction.objectStore(DATABASE_NAME);

}


// each table is populated with rows from database
function populateTables(db) {
    let transaction = db.transaction(COMPONENTS_DB_NAME);
    let tables = transaction.objectStore(COMPONENTS_DB_NAME);
    let list = tables.openCursor();
    list.onsuccess = (event) => { 
        let cursor = event.target.result;
        if (!cursor) return; 
        let cursorValue = cursor.value;

        populateRow(document.getElementById('gpu-table'), cursorValue);
        cursor.continue(); 
    }

    list.onerror = () => {
        console.log("Could not load items.")
    }
}


function showTables(id) {
    let table = document.getElementById(id);
    //hideTables();
    table.style.display = 'block';
}

// onload in body
function start() {
    initializeNavigation();
    setupLoginButton();

    let req = window.indexedDB.open(COMPONENTS_DB_NAME, VERSION);
    req.onsuccess = () => {
        console.log("Database opened successfully.");
        let db = req.result;
        populateTables(db);
        console.log("Tables populated.")
    }
    req.onupgradeneeded = (e) => { 
        let db = req.result;
        let version = e.oldVersion;
        let tx = req.transaction;
        console.log("Old version was", version);

        if (version === 0) {
            store = db.createObjectStore(DATABASE_NAME, {keyPath: 'id'}),
            index = store.createIndex("id", "id", {unique: true});
            
            tx.oncomplete = () => {
                console.log("Transcation completed.")
                initializeComponents(db);
            };
        }
    }
    req.onerror = function(e) { 
        console.log("There was an error: " + e.target.errorCode);
    };

    let req_sc = window.indexedDB.open(CART_DB_NAME, VERSION);

    req_sc.onsuccess = () => {
        shoppingCart = req_sc.result;
        console.log("Cart database loaded.");
    }
    req_sc.onupgradeneeded = (e) => {
        let db_sc = req_sc.result;
        let version_sc = e.oldVersion;
        console.log("Old version was", version_sc);

        if (version_sc === 0) {
            store_sc = db_sc.createObjectStore(CART_DB_NAME, {keyPath: 'name'}),
            index_sc = store_sc.createIndex("name", "name", {unique: true});
            console.log("Shopping Cart created.");
        }
    }
    hideTables();
}