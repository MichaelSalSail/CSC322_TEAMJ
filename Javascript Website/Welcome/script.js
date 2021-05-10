let database;

function displayStaffSystems() {
    let container = document.getElementById('suggested-pcs')
    for (let i = 0; i < 3; i++) {
        let current = STAFF_SYSTEMS[i];
        let subContainer = document.createElement("div");
        subContainer.style.display = 'inline';
        subContainer.style.float = 'left';
        subContainer.style.padding = "5%";
        let info = document.createElement("span"); 
        info.innerHTML = "</br>" +
        current[0] + "</br>" +
        current[3]  + "</br>" +
        "$"+ current[1]  + "</br>";

        let img = document.createElement("img");
        img.src = "../Images/" + current[3].toUpperCase() +
                "/" + current[0] + ".PNG";
        img.setAttribute("style","width:200px");
        img.setAttribute("style","height:200px");

        //console.log(STAFF_SYSTEMS[i]);       
        
        subContainer.appendChild(img);
        subContainer.appendChild(info);
        container.appendChild(subContainer);
    }
}

function displayMostSoldSystems(systems) {
    // top 3 most sold
    let container = document.getElementById('most-sold-pcs');
    for (let i = 0; i < 3; i++) {
        let subContainer = document.createElement("div");
        subContainer.style.display = 'inline';
        subContainer.style.float = 'left';
        subContainer.style.padding = "5%";
        let currentSystem = systems[i];
        let info = document.createElement("span");
        //info.setAttribute("style", "display: inline")
        info.innerHTML = 
            "</br>" + currentSystem.name + "</br>" +
            currentSystem.type + "</br>" +
            "$" + currentSystem.price + "</br>" +
            "Units sold: " + currentSystem.sales + "</br>";
        subContainer.appendChild(createImage(currentSystem, ".PNG"));
        subContainer.appendChild(info);
        container.appendChild(subContainer);
    }
}

function loadMostSoldSystems() {
    let topSales = [];
    let tx = database.transaction(SYSTEMS_DB_NAME);
    let store = tx.objectStore(SYSTEMS_DB_NAME);
    let idx = store.index('sales');
    idx.openCursor(null, "prev").onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            topSales.push(cursor.value);
            cursor.continue();
        } else {
            console.log(topSales[0].sales);
            displayMostSoldSystems(topSales);
        }
    };
}

/* Each system has the following attributes:
name, price, description, type (gaming, business, computing), operating system, sales */
function initializeSystems(database) {
    tx = database.transaction(SYSTEMS_DB_NAME, "readwrite");
    store = tx.objectStore(SYSTEMS_DB_NAME);
    for (let outer = 0; outer < SYSTEMS.length; outer++) {
        for (let i = 0; i < SYSTEMS[0].length; i++) {
            let saleNumber = Math.round((Math.random()*10000) + 1) // sale # will be from 1-10000
            store.put({
                name: SYSTEMS[outer][i][0],
                price: SYSTEMS[outer][i][1],
                description: SYSTEMS[outer][i][2],
                type: SYSTEMS[outer][i][3],
                os: SYSTEMS[outer][i][4],
                manufacturer: SYSTEMS[outer][i][5],
                sales: saleNumber
            });
        }
    }
    
    tx.oncomplete = () => {
        console.log("Systems loaded");
    };
}

function start() {

    initializeNavigation();
    document.getElementById("welcome").innerHTML += window.localStorage.getItem("username");
    if(window.localStorage.getItem("username")!=="Guest")
    {
        document.getElementById("user_option_1").status_1.innerHTML = "Logout";
    }

    // First line of Home Page
    let line_1_a="Welcome to PC Emporium! Whether you are trying to build a computer from scratch or " + 
                 "purchase a complete computer, our catalog includes every Operating System from the " + 
                 "best manufacturers.*";
    let line_1_b="Welcome to PC Emporium! Whether you are trying to build a computer from scratch or " +                
                 "*purchase a complete computer, our catalog includes every Operating System from the "+                  
                 "best manufacturers.";

    // Second line of Home Page
    let line_2_a="*You are unable to purchase from the Marketplace or comment on the Forum. Please " +                   
                 "consider signing up and logging in.";
    let line_2_b="*A working credit card is required for checkout. Alternatively, you can use your balance " +                 
                 "given sufficient funds.";

    // Third line of Home Page
    let line_3_a="As a visitor, you may explore the website.";
    let line_3_b="As a registered customer, you may engage on the Forum. You can also view your " +                       
                 "Account Info and Add to Cart.";
    let line_3_c="As a deliverer, please stay updated on all current purchases! Make your bids as soon as " +                
                 "possible to not keep our customers waiting. It's much appreciated.";
    let line_3_d="As a manufacturer, please stay updated on Forum posts. If a Registered Customer " +
                 "complains about your products, you must provide your side of the argument to avoid a " +
                 "warning from the Store Manager."
    let line_3_e="As a store clerk, please stay updated on all current bids! Don't keep the customers " +                    
                 "purchase(s) waiting. If you don't choose the lowest bid, please write a message including " +              
                 "your reasoning. The store manager is constantly monitoring activity! Please act " +                         
                 "responsibly.";
    let line_3_f="As a store manager, you have the highest privilege's of any user. You can suspend any " +
                 "user as you see fit. You have access to every part of the website.";


    // Visitor
    if(window.localStorage.getItem("permission")==0)
    {
        document.getElementById("line_1").innerHTML = line_1_a;
        document.getElementById("line_2").innerHTML = line_2_a;
        document.getElementById("line_3").innerHTML = line_3_a;
    }
    // Everyone else
    else
    {
        document.getElementById("line_1").innerHTML = line_1_b;
        document.getElementById("line_2").innerHTML = line_2_b;
        // Registered Customer
        if(window.localStorage.getItem("permission")==1)
            document.getElementById("line_3").innerHTML = line_3_b;
        // Deliverer
        else if(window.localStorage.getItem("permission")==2)
            document.getElementById("line_3").innerHTML = line_3_c;
        // Manufacturer
        else if(window.localStorage.getItem("permission")==3)
            document.getElementById("line_3").innerHTML = line_3_d;
        // Store Clerk
        else if(window.localStorage.getItem("permission")==4)
            document.getElementById("line_3").innerHTML = line_3_e;
        // Store Manager
        else if(window.localStorage.getItem("permission")==5)
            document.getElementById("line_3").innerHTML = line_3_f;  
    }


    let req = window.indexedDB.open(SYSTEMS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        console.log("Systems database loaded.");
        database = e.target.result;
        loadMostSoldSystems();
    }
    req.onupgradeneeded = (e) => {
        tx = req.transaction;
        let version = e.oldVersion;
        if (version === 0) {
            store = e.target.result.createObjectStore(SYSTEMS_DB_NAME, {keyPath: "name"}),
            store.createIndex("name", "name", {unique: true});
            store.createIndex("sales", "sales", {unique:false});
        }
        tx.oncomplete = () => {
            initializeSystems(e.target.result);
            console.log("Loaded systems in database.")
        }
    }
    displayStaffSystems()
    initializeNavigation();
}

function test(){
    class Post {
        constructor(author, message) {
            this.author = author;
            this.message = message;
        }
    }

    let db;
    let req = window.indexedDB.open("test", VERSION);
    req.onsuccess = (e) => {
        db = e.target.result
        let tx = db.transaction("test", 'readwrite');
        let store = tx.objectStore("test");
        let post = new Post("Bob", "test message");
        let data = [post, new Post("ABC", "abc")];
        

        let res = e.target.result;
        store.put({
            name: "c",
            messages: [new Post("1","1"), new Post("2", "2")]
        })
        /*
        store.put({
            name: "2",
            test: 
        });*/
    }
    req.onupgradeneeded = (e) => {
        tx = req.transaction;
        let version = e.oldVersion;
        if (version === 0) {
            store = e.target.result.createObjectStore("test", {keyPath: "name"}),
            store.createIndex("name", "name", {unique: true});
        }
    }
}