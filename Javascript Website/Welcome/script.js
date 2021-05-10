/* Each system has the following attributes:
name, price, description, type (gaming, business, computing), operating system, sales */
function initializeSystems() {
    tx = database.transaction(SYSTEMS_DB_NAME, "readwrite");
    store = tx.objectStore(SYSTEMS_DB_NAME);
    for (let outer = 0; outer < SYSTEMS.length; outer++) {
        for (let i = 0; i < SYSTEMS[0].length; i++) {
            store.put({
                name: SYSTEMS[outer][i][0],
                price: SYSTEMS[outer][i][2],
                description: SYSTEMS[outer][i][1],
                type: SYSTEMS[outer][i][3],
                os: SYSTEMS[outer][i][4]
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
    req.onsuccess = () => {
        database = req.result;
    }

    req.onupgradeneeded = (e) => {
        database = req.result;
        let version = e.oldVersion;
        let tx = req.transaction;
        console.log("Old version was", version);

        if (version === 0) {
            store = database.createObjectStore(SYSTEMS_DB_NAME, {keyPath: 'name'}),
            index = store.createIndex("name", "name", {unique: true});
            tx.oncomplete = () => {
                console.log("Transcation completed.")
                initializeSystems(database);
            };
        }
    }
}