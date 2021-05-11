// checkout page 1
function start1() {
    initializeNavigation();
    let continue_button=document.querySelector("#Transition_pay");
    let buttons = document.querySelectorAll("[name=A]");
    let output = document.querySelector("#error_message");
    for (let button of Array.from(buttons)) {
      button.addEventListener("change", () => {
        if(button.value=="")
        {
          output.textContent = button.value;
          continue_button.action="Checkout_II_index.html";
        }
        else
        {
          output.textContent = "You have "+ window.localStorage.getItem("balance") + " points.";
          continue_button.action="Checkout_IIb_index.html";
        }
    });
  }
}

// checkout 2
function start2() {
    let form0 = document.querySelector("#first");
    let form00 = document.querySelector("#fourth");
    let form1 = document.querySelector("#second");//querySelector("form")
    let output1 = document.querySelector("#error_message1");
    let state_good=false;
    let zip_good=false;
    let credit_good=false;
    form1.addEventListener("input", () => {
      let zip = form1.elements.State.value;
      let isAlpha = /^\+?[A-Z]{2}$/.test(zip);
      if(zip.length == 2 && isAlpha)
      {
        output1.textContent = "Good";
        state_good=true;
      }
      else
      {
        output1.textContent = "A state must be 2 capital letters";
        state_good=false;   
      }
      /*if(form1.elements.State.value.length!==2)
      {
        output1.textContent = "A state must be of length 2";
        state_good=false;
      }
      else
      {
        output1.textContent = "Good";
        state_good=true;
      }*/
    });
    form2 = document.querySelector("#third");//querySelector("form")
    output2 = document.querySelector("#error_message2");
    form2.addEventListener("input", () => {
      let zip = form2.elements.ZipCode.value;
      let isInteger = /^\+?(0|[1-9]\d*)$/.test(zip);
      if(zip.length == 5 && isInteger)
      {
        output2.textContent = "Good";
        zip_good=true;
      }
      else
      {
        output2.textContent = "A zip code must be 5 digits";
        zip_good=false;   
      }
    });
    form3 = document.querySelector("#fifth");//querySelector("form")
    output3 = document.querySelector("#error_message3");
    form3.addEventListener("input", () => {
      let zip = form3.elements.Credit.value;
      let isInteger = /^\+?(0|[1-9]\d*)$/.test(zip);
      if(zip.length == 16 && isInteger)
      {
        output3.textContent = "Good";
        credit_good=true;
      }
      else
      {
        output3.textContent = "A Credit Card # must be 16 digits";
        credit_good=false;   
      }
      /*if(form3.elements.Credit.value.length!==16)
      {
        output3.textContent = "A Credit Card # must be 16 digits";
        credit_good=false;
      }
      else
      {
        output3.textContent = "Good";
        credit_good=true;
      }*/
    });
    let submit_button=document.querySelector("#sixth");
    submit_button.addEventListener("submit", event => {
      if(state_good==false | zip_good==false | credit_good==false | form0.elements.Name.value.length==0 | form00.elements.Address.value.length==0)
      {
        alert("Properly complete all text fields");
        event.preventDefault();
      }
    });
    initializeNavigation();
}

// checkout 2b
function start2b() {
    initializeNavigation();
    let form0 = document.querySelector("#first");
    let form00 = document.querySelector("#fourth");
    let form1 = document.querySelector("#second");//querySelector("form")
    let output1 = document.querySelector("#error_message1");
    let state_good=false;
    let zip_good=false;
    form1.addEventListener("input", () => {
      let zip = form1.elements.State.value;
      let isAlpha = /^\+?[A-Z]{2}$/.test(zip);
      if(zip.length == 2 && isAlpha)
      {
        output1.textContent = "Good";
        state_good=true;
      }
      else
      {
        output1.textContent = "A state must be 2 capital letters";
        state_good=false;   
      }
      /*if(form1.elements.State.value.length!==2)
      {
        output1.textContent = "A state must be of length 2";
        state_good=false;
      }
      else
      {
        output1.textContent = "Good";
        state_good=true;
      }*/
    });
    form2 = document.querySelector("#third");//querySelector("form")
    output2 = document.querySelector("#error_message2");
    form2.addEventListener("input", () => {
      let zip = form2.elements.ZipCode.value;
      let isInteger = /^\+?(0|[1-9]\d*)$/.test(zip);
      if(zip.length == 5 && isInteger)
      {
        output2.textContent = "Good";
        zip_good=true;
      }
      else
      {
        output2.textContent = "A zip code must be 5 digits";
        zip_good=false;   
      }
    });
    let submit_button=document.querySelector("#fifth");
    submit_button.addEventListener("submit", event => {
      if(state_good==false | zip_good==false | form0.elements.Name.value.length==0 | form00.elements.Address.value.length==0)
      {
        alert("Properly complete all text fields");
        event.preventDefault();
      }
    });
}




let cart;
let purchases;

function updateUser() {
  let email = localStorage.getItem("email");
  let remainingBalance = 
  (+window.localStorage.getItem("balance")) - +window.localStorage.getItem("payment");
  document.getElementById("payment").innerHTML += window.localStorage.getItem("payment");
  document.getElementById("balance").innerHTML += remainingBalance + " points.";
  window.localStorage.setItem("balance", ""+remainingBalance) // deduct purchase from balance

  req = window.indexedDB.open(USERS_DB_NAME, VERSION);
  req.onsuccess = () => updateCurrentUserBalance(req.result, remainingBalance, email);
}

function addPurchaseToDatabase() {
  let purchase = []; // arr of components
  let tx = cart.transaction(CART_DB_NAME);
  let cartStore = tx.objectStore(CART_DB_NAME);
  let openCursor = cartStore.openCursor();
  openCursor.onsuccess = (e) => {
    console.log("Cursor has been opened")
    let cursor = e.target.result;
    if (cursor) {
      let current = cursor.value;
      purchase.push(current);
      cursor.continue();
    } else {
      loadIntoPurchasesDB(purchase);
    }
  }
}

function loadIntoPurchasesDB(purchase) {
  let store = purchases.transaction(PURCHASES_DB_NAME, "readwrite").objectStore(PURCHASES_DB_NAME);
  store.put({
    email: localStorage.getItem("email"),
    purchase: purchase,
    payment: parseInt(localStorage.getItem("payment")),
    tracking: "n/a"
  });
}

function removeItemsInCart() {
  let req = window.indexedDB.deleteDatabase(CART_DB_NAME);
  req.onerror = () => console.log("Error deleting database.");
  req.onsuccess = () => console.log("Database deleted successfully");
}

function start() {  
  let req = window.indexedDB.open(CART_DB_NAME, VERSION);
  req.onsuccess = (e) => {
    cart = e.target.result;
  }

  let purchasesReq = window.indexedDB.open(PURCHASES_DB_NAME, VERSION);
  purchasesReq.onsuccess = (e) => {
    console.log("Loaded purchases DB.")
    purchases = e.target.result;
    addPurchaseToDatabase();
    window.localStorage.removeItem("payment");
  }
  purchasesReq.onupgradeneeded = (e) => {
    let tx = purchasesReq.transaction;
    let store = e.target.result.createObjectStore(PURCHASES_DB_NAME, {autoIncrement: true});
    store.createIndex("email", "email", {unique: false});
    tx.oncomplete = (e) => {
      console.log("Created purchases DB.")
      purchases = e.target.result;
    }
  }

  updateUser();
  removeItemsInCart();
  initializeNavigation();
}

