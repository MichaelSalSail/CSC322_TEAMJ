let shoppingCart_db;
let systems_db;
let components_db;

// attr: "name", "description", "price", "manufacturer", "type"
// traverses 3D array to add component attributes to database
function initializeComponents(db) {
    tx = components_db.transaction(COMPONENTS_DB_NAME, "readwrite");
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

// creates a button with an onclick function. args is an array to be used as a parameter
// for the clickFunction
function createButton(text, clickFunction, args){
    let btn = document.createElement('button');
    btn.innerHTML = text;
    btn.addEventListener('click', () => {
        clickFunction.apply(this, args);
    });
    return btn;
}

// creates row with td, adds image, attributes, add to cart btn
function populatePartsRow(table, cursorValue) {
    const NUMBER_OF_CELLS = COMPONENT_HEADER_NAMES.length + 1; // one more cell for button
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

    cells[0].appendChild(createImage(cursorValue, ".jpg"));
    cells[5].appendChild(createButton("Add to Cart", addItemToCart, [cursorValue])); // add to cart
}

function toggleModal() {
    let modal = document.querySelector(".modal");
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    let modal = document.querySelector(".modal");
    if (event.target === modal) 
        toggleModal();
}

function viewDetails(cursorValue) {
    document.getElementById('comp-desc').innerHTML = cursorValue.description;
    toggleModal();
}

function populateComputerRow(table, cursorValue) {
    const NUMBER_OF_CELLS = TABLE_COMPUTER_IDs.length + 2; // + view details, add to cart
    let cells = [];
    let row = document.createElement('tr');
    table.appendChild(row);
    for (let i = 0; i < NUMBER_OF_CELLS; i++){
        let cell = document.createElement('td');
        cells.push(cell);
    }

    cells[1].innerHTML = cursorValue.name;
    cells[2].innerHTML = cursorValue.os;
    cells[3].innerHTML = cursorValue.price;
    cells[4].innerHTML = cursorValue.manufacturer;

    for (let i = 0; i < cells.length; i++) row.appendChild(cells[i]);

    cells[0].appendChild(createImage(cursorValue, '.PNG'));
    cells[5].appendChild(createButton("View Details", viewDetails, [cursorValue]));
    cells[6].appendChild(createButton("Add to Cart", addItemToCart, [cursorValue]));
}

function addItemToCart(component) {
    if (localStorage.getItem("permission") === "0") {
        alert("You must be registered in order to add products to your cart.");
        return;
    }

    let tx = shoppingCart_db.transaction(CART_DB_NAME, "readwrite");
    let store = tx.objectStore(CART_DB_NAME);
    let req = store.get(component.name);
    req.onsuccess = (e) => {
        if (e.target.result) {
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

function populateComputerTables() {
    let transaction = systems_db.transaction(SYSTEMS_DB_NAME);
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
function populatePartsTables() {
    let transaction = components_db.transaction(COMPONENTS_DB_NAME);
    let tables = transaction.objectStore(COMPONENTS_DB_NAME);
    let list = tables.openCursor();
    list.onsuccess = (event) => { 
        let cursor = event.target.result;
        if (!cursor) return; 
        let cursorValue = cursor.value;
        //console.log(cursorValue);

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

function createTables(ids, headerNames) {
    let container = document.getElementById('component-tables');
    for (let i = 0; i < ids.length; i++) {
        let table = document.createElement('table');
        let row = document.createElement('tr');
        table.id = ids[i];

        for (let j = 0; j < headerNames.length; j++) {
            let header = document.createElement('th')
            header.innerHTML = headerNames[j];
            row.appendChild(header);
        }

        table.appendChild(row);
        container.appendChild(table);
    }
}

function hideTables() {
    for (let i = 0; i < TABLE_COMPONENT_IDs.length; i++)
        document.getElementById(TABLE_COMPONENT_IDs[i]).style.display = 'none';  
    
    for (let i = 0; i < TABLE_COMPUTER_IDs.length; i++)
        document.getElementById(TABLE_COMPUTER_IDs[i]).style.display = 'none'; 
}

function showTables(id) {
    let table = document.getElementById(id);
    hideTables();
    table.style.display = 'block';
}

// onload in body
function start() {
    initializeNavigation();
    setupLoginButton()

    document.getElementById('close-btn').addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);

    // Initialize components database
    let req = window.indexedDB.open(COMPONENTS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        let res = e.target.result
        components_db = res;
        initializeComponents(res);
        populatePartsTables(res);
    }
    
    req.onerror = (e) => console.log("There was an error: " + e.target.errorCode);

    // initialize computers database
    let systems = window.indexedDB.open(SYSTEMS_DB_NAME, VERSION);
    systems.onsuccess = (e) => {
        systems_db = e.target.result;
        populateComputerTables()
    }
    
    // initialize shopping cart database
    let cart = window.indexedDB.open(CART_DB_NAME, VERSION);
    cart.onsuccess = (e) => shoppingCart_db = e.target.result;
    cart.onupgradeneeded = (e) => {
        let store = e.target.result.createObjectStore(CART_DB_NAME, {keyPath: "name"});
        store.createIndex("name", "name", {unique: true});
    }
    
    createTables(TABLE_COMPONENT_IDs, COMPONENT_HEADER_NAMES);
    createTables(TABLE_COMPUTER_IDs, COMPUTER_HEADER_NAMES);
    hideTables();
}