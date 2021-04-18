const DATABASE_NAME = "HardwareComponentsDatabase"
let VERSION = 1; // **need to increment each time db is upgraded

const req = window.indexedDB.open(DATABASE_NAME, VERSION);

req.onsuccess = () => {
    let results = req.result;
    let transaction = results.transaction('HardwareStore');
    let tables = transaction.objectStore("HardwareStore");

    console.log(results); // this is the database -- "HardwareComponentsDatabase"
    console.log(tables); // this is the store "HardwareStore"


    // getting by index:
    let INDEX_NAME = "HardwareType";
    let index = tables.index(INDEX_NAME);
    let getByIndexNumber = tables.get(0);
    let getByIndexName = index.get('GPU');

    getByIndexNumber.onsuccess = () => {
        console.log("Got row: ", getByIndexNumber.result);
        // if we want to get a specific attribute: 'hardwareID', 'name', 'type', 'description'
        console.log("Hardware id is", getByIndexNumber.result.hardwareID);
        console.log("Name is", getByIndexNumber.result.name);
        console.log("Type is", getByIndexNumber.result.type);
        console.log("Desc. is", getByIndexNumber.result.description);
    }

    getByIndexName.onsuccess = () => console.log("Got row by index", getByIndexName.result);

    // if we want to iterate through the entire store:
    let list = tables.openCursor(); // open a cursor to read the store
    list.onsuccess = (event) => { // if opening the cursor is successful, now we can read stuff
        let cursor = event.target.result; // this is the cursor object 
        if (!cursor) return; // null check
        console.log(cursor); 
        console.log(cursor.value); // this is our row. if you want a specific value like name --
        console.log(cursor.value.name);
        // we have seen this row, so move to next one
        cursor.continue(); // moves the cursor to next row. remember to null check.
    }

    transaction.oncomplete = () => {
        console.log("Transaction completed. Closing database")
        db.close(results); // close db once we are done with whatever
    }
}

req.onerror = () => {
    console.log("DB could not be opened. Check if the name is correct");
}

/* Additional notes for button events:
let's say we have a button with the id: "myButton"
get the button by doing

let btn  = document.getElementById("myButton");

if we want to attach a CLICK listener to it:
btn.addEventListener("click", myFunction());

where "click" is the event. look here for more info: 
https://www.w3schools.com/js/js_htmldom_eventlistener.asp

where myFunction() is your defined function. there is another way to do this in the HTML:

1. go to your html button tag 
2. in the tag, use the onclick keyword
e.g. we have a button <button id = 'mybtn'> </button>
and the function we want is called foo()

then,

<button id = 'mybtn' onclick = 'foo()'> </button>

achieves the same thing.

*/
