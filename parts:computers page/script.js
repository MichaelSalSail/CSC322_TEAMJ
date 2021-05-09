let shoppingCart;

// Store constants
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
        db.close();
    };
}

// creates row with td, adds image, attributes, add to cart btn
function populateRow(table, cursorValue) {
    const NUMBER_OF_CELLS = 6;
    let filePath = "Images/" + cursorValue.type + "/" + cursorValue.name + ".jpg";
    let cells = [];
    let row = document.createElement('tr');
    table.appendChild(row);
    for (let i = 0; i < NUMBER_OF_CELLS; i++){
        let cell = document.createElement('td');
        cells.push(cell);
    }

    let img = document.createElement('img');
    img.setAttribute("style","width:200px");
    img.setAttribute("style","height:200px");
    img.src = filePath;

    cells[1].innerHTML = cursorValue.name;
    cells[2].innerHTML = cursorValue.description;
    cells[3].innerHTML = cursorValue.price;
    cells[4].innerHTML = cursorValue.manufacturer;

    for (let i = 0; i < cells.length; i++) row.appendChild(cells[i]);

    let btn = document.createElement('button');
    btn.innerHTML = "Add to Cart";
    btn.addEventListener('click', () => {
        addItemToCart(cursorValue);
    });

    cells[0].appendChild(img);
    cells[5].appendChild(btn); // add to cart
}

function addItemToCart(component) {
    if (localStorage.getItem("permission") === "0") {
        alert("You must be registered in order to add products to your cart.");
        return;
    }

    let tx = shoppingCart.transaction(CART_DB_NAME, "readwrite");
    let store = tx.objectStore(CART_DB_NAME);
    let req = store.get(component.name);
    req.onsuccess = () => {
        if (req.result) {
            store.put({
                name: component.name,
                price: component.price,
                quantity: req.result.quantity + 1
            });
            console.log("Item already exists in cart. Updating quantity.")  
        } else {
            console.log("Item does not exist in cart. Adding...")
            store.put({
                name: component.name,
                price: component.price,
                quantity: 1
            });
        }
    }
    console.log("Successfully added to cart.");
    alert("Added to cart.")
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

        switch(cursorValue.type) {
            case 'GPU':
                populateRow(document.getElementById('gpu-table'), cursorValue);
                break;
            case 'CPU':
                populateRow(document.getElementById('cpu-table'), cursorValue);
                break;
            case 'MOBO':
                populateRow(document.getElementById('mobo-table'), cursorValue);
                break;
            case 'RAM':
                populateRow(document.getElementById('ram-table'), cursorValue);
                break;
            case 'STORAGE':
                populateRow(document.getElementById('storage-table'), cursorValue);
                break;
            case 'PSU':
                populateRow(document.getElementById('psu-table'), cursorValue);
                break;
            case 'CASE':
                populateRow(document.getElementById('case-table'), cursorValue);
                break;
            default:
                break;
        }
        cursor.continue(); 
    }

    list.onerror = () => {
        console.log("Could not load items.")
    }
}

function hideTables() {
    document.getElementById('gpu-table').style.display = 'none';
    document.getElementById('gpu-table').style.display = 'none';    
    document.getElementById('cpu-table').style.display = 'none';
    document.getElementById('mobo-table').style.display = 'none';
    document.getElementById('ram-table').style.display = 'none';
    document.getElementById('storage-table').style.display = 'none';
    document.getElementById('psu-table').style.display = 'none';
    document.getElementById('case-table').style.display = 'none';
}

function showTables(id) {
    let table = document.getElementById(id);
    hideTables();
    table.style.display = 'block';
}

// onload in body
function start() {
    initializeNavigation();
    document.getElementById("welcome").innerHTML += window.localStorage.getItem("username");

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
            store = db.createObjectStore(COMPONENTS_DB_NAME, {keyPath: 'name'}),
            index = store.createIndex("name", "name", {unique: true});
            
            tx.oncomplete = () => {
                console.log("Transcation completed.")
                initializeComponents(db);
            };
        }
    }
    req.onerror = function(e) { 
        console.log("There was an error: " + e.target.errorCode);
    };

    let req_sc = window.indexedDB.open(CART_DB_NAME, 1);

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