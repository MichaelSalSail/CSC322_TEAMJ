let shoppingCart_db;
let systems_db;

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



function createImage(cursorValue) {
    let filePath = "../Images/" + cursorValue.type + "/" + cursorValue.name + ".jpg";
    let img = document.createElement('img');
    img.setAttribute("style","width:200px");
    img.setAttribute("style","height:200px");
    img.src = filePath;

    return img;
}

// creates row with td, adds image, attributes, add to cart btn
function populatePartsRow(table, cursorValue) {
    const NUMBER_OF_CELLS = 6;
    let cells = [];
    let row = document.createElement('tr');
    table.appendChild(row);
    for (let i = 0; i < NUMBER_OF_CELLS; i++){
        let cell = document.createElement('td');
        cells.push(cell);
    }

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

    cells[0].appendChild(createImage(cursorValue));
    cells[5].appendChild(btn); // add to cart
}

function populateComputerRow(table, cursor) {

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

function populateComputerTables(db) {
    let transaction = db.transaction(SYSTEMS_DB_NAME);
    let tables = transaction.objectStore(SYSTEMS_DB_NAME);
    let list = tables.openCursor();
    list.onsuccess = (event) => { 
        let cursor = event.target.result;
        if (!cursor) return; 
        let cursorValue = cursor.value;

        switch(cursorValue.type) {
            case 'Business':
                populateComputerRow(document.getElementById('business-table'), cursorValue);
                break;
            case 'Gaming':
                populateComputerRow(document.getElementById('gaming-table'), cursorValue);
                break;
            case 'Streaming':
                populateComputerRow(document.getElementById('streaming-table'), cursorValue);
                break;
            default:
                break;
        }

        switch(cursorValue.os) {
            case 'Windows':
                populateComputerRow(document.getElementById('windows-table'), cursorValue);
                break;
            case 'macOS':
                populateComputerRow(document.getElementById('mac-table'), cursorValue);
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

// each table is populated with rows from database
function populatePartsTables(db) {
    let transaction = db.transaction(COMPONENTS_DB_NAME);
    let tables = transaction.objectStore(COMPONENTS_DB_NAME);
    let list = tables.openCursor();
    list.onsuccess = (event) => { 
        let cursor = event.target.result;
        if (!cursor) return; 
        let cursorValue = cursor.value;

        switch(cursorValue.type) {
            case 'GPU':
                populatePartsRow(document.getElementById('gpu-table'), cursorValue);
                break;
            case 'CPU':
                populatePartsRow(document.getElementById('cpu-table'), cursorValue);
                break;
            case 'MOBO':
                populatePartsRow(document.getElementById('mobo-table'), cursorValue);
                break;
            case 'RAM':
                populatePartsRow(document.getElementById('ram-table'), cursorValue);
                break;
            case 'STORAGE':
                populatePartsRow(document.getElementById('storage-table'), cursorValue);
                break;
            case 'PSU':
                populatePartsRow(document.getElementById('psu-table'), cursorValue);
                break;
            case 'CASE':
                populatePartsRow(document.getElementById('case-table'), cursorValue);
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

function createTables(ids) {
    let container = document.getElementById('component-tables');
    for (let i = 0; i < ids.length; i++) {
        let table = document.createElement('table');
        let row = document.createElement('tr');
        table.id = ids[i];
        for (let j = 0; j < COMPONENT_HEADER_NAMES.length; j++) {
            let header = document.createElement('th')
            header.innerHTML = COMPONENT_HEADER_NAMES[j];
            row.appendChild(header);
        }
        table.appendChild(row);
        container.appendChild(table);
    }
}

function hideTables() {
    for (let i = 0; i < TABLE_COMPONENT_IDs.length; i++)
        document.getElementById(TABLE_COMPONENT_IDs[i]).style.display = 'none';  
    
    /*
    for (let i = 0; i < TABLE_COMPUTER_IDs.length; i++)
        document.getElementById(TABLE_COMPUTER_IDs[i]).style.display = 'none'; 
    */
}

function showTables(id) {
    let table = document.getElementById(id);
    hideTables();
    table.style.display = 'block';
}

// onload in body
function start() {
    initializeNavigation();

    // Initialize components database
    let req = window.indexedDB.open(COMPONENTS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        initializeComponents(e.target.result);
        populatePartsTables(e.target.result);
    }
    req.onupgradeneeded = (e) => createStore(e, COMPONENTS_DB_NAME, "name");
    req.onerror = (e) => console.log("There was an error: " + e.target.errorCode);

    // initialize computers database
    let systems = window.indexedDB.open(SYSTEMS_DB_NAME, VERSION);
    systems.onsuccess = (e) => systems_db = e.target.result;
    
    // initialize shopping cart database
    let cart = window.indexedDB.open(CART_DB_NAME, VERSION);
    cart.onsuccess = (e) => shoppingCart_db = e.target.result;
    cart.onupgradeneeded = (e) => createStore(e, CART_DB_NAME, "name");
    
    createTables(TABLE_COMPONENT_IDs);
    createTables(TABLE_COMPUTER_IDs);
    hideTables();
}