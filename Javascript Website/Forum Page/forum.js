let forumsDB;
let usersDB;
let permission = parseInt(localStorage.getItem("permission"));

function addValuesToDB(title, text, type) {
    let processedText = checkPostForTaboo(text)
    let processedTitle = checkPostForTaboo(title)
    let author = localStorage.getItem("username");
    forumsDB.transaction(FORUMS_DB_NAME, "readwrite").objectStore(FORUMS_DB_NAME)
        .put({
            author: author,
            title: processedTitle,
            posts: [new Post(author, processedText)],
            type: type
        });
}

// if the tagged user is valid, give them a warning since this is a complaint.
// otherwise tell user the tagged user does not exist
function checkValidUser(user) {
    let store = usersDB.transaction(USERS_DB_NAME, "readwrite").objectStore(USERS_DB_NAME);
    let index = store.index("username");
    index.openCursor(user).onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            let res = cursor.value;
            if (res.warning + 1 >= 3) {// suspend user
                suspendUser(usersDB, res);
                return;
            }
            store.put({
                email: res.email,
                username: res.username,
                password: res.password,
                balance: res.balance,
                rewards: res.rewards,
                permission: res.permission,
                warning: res.warning + 1
            })
            window.location.href = "index.html";
        }
        else 
            alert("The user does not exist. Please check your input again.");        
    }
}

function createPost() {
    let title = document.getElementById("title").value;
    let radioButtons = document.getElementsByName("tag");
    let threadText = document.getElementById("mytextarea").value;
    let selected;
    let taggedUser = "";

    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            selected = radioButtons[i];
            if (radioButtons[i].value === "Service Complaint")
                taggedUser += document.getElementById("input").value;
        }
    }
    if (!selected) return;
    if (taggedUser.length > 1) checkValidUser(taggedUser);
    
    console.log("Title of thread:", title,"\nSelected button's value:",
    selected.value, "\nThe tagged user is:",taggedUser,"\n Thread Msg:", threadText);
    addValuesToDB(title, threadText, selected.value);
}

function toggleInput() {
    let div = document.getElementById("tagInput");
    let button = document.getElementById("complaint");
    div.style.display = button.checked ? "block" : "none";
}

function onThreadStart() {
    initializeNavigation();
    setupLoginButton();
    

    document.getElementById("tagInput").style.display = 'none';

    let req = window.indexedDB.open(FORUMS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        forumsDB = e.target.result;
        console.log("Forums DB loaded.")
    }

    let userReq = window.indexedDB.open(USERS_DB_NAME, VERSION);
    userReq.onsuccess = (e) => {
        usersDB = e.target.result;
        console.log("Users DB loaded.")
    }
}

function viewThread(key, title) {
    localStorage.setItem("threadKey", key);
    localStorage.setItem("threadTitle", title);
    window.location.href = 'posts.html';
}

function loadThreadsInTable() {
    let table = document.getElementById("table");
    forumsDB.transaction(FORUMS_DB_NAME).objectStore(FORUMS_DB_NAME).openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            let value = cursor.value;
            let row = document.createElement("tr");
            let btn = createButton("View Thread", viewThread, [cursor.key, value.title]);
            row.innerHTML = 
                "<td>" + value.author + "</td>" + 
                "<td>" + value.title + "</td>" + 
                "<td>" + value.type + "</td>" +
                "<td>" + value.posts.length + "</td>";
            let cell = document.createElement('td');
            cell.appendChild(btn);
            row.appendChild(cell);
            table.appendChild(row);
            cursor.continue();
        } 
    }
}

function createPostElement(author, message) {
    let container = document.getElementById('container');
    let post = document.createElement('div');
    post.id = "post-container"
    let authorText = document.createElement('h3');
    authorText.innerHTML = author;
    authorText.id = "author";
    
    let messageText = document.createElement('span');
    messageText.innerHTML = message;
    messageText.id = "message";

    post.appendChild(authorText);
    post.appendChild(messageText);
    container.appendChild(post);
}

function checkPostForTaboo(text) {
    let arr = text.split(/\W+/);
    console.log(arr)
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < TABOO_WORDS.length; j++) {
            if (arr[i] === TABOO_WORDS[j]) arr[i] = "****";
        }
    }
    return arr.join(" ");
}

function addPostToThread() {
    let key = parseInt(localStorage.getItem("threadKey"));
    let postText = document.getElementById("mytextarea").value;
    let username = localStorage.getItem("username");
    let processedText = checkPostForTaboo(postText);
    let store = forumsDB.transaction(FORUMS_DB_NAME, "readwrite").objectStore(FORUMS_DB_NAME);
    let tx = store.get(key);
    tx.onsuccess = (e) => {
        let res = e.target.result;
        let posts = res.posts;
        posts.push(new Post(username, processedText))
        store.put({
            author: res.author,
            posts: posts,
            title: res.title,
            type: res.type
        }, key)
        window.location.reload();
    }
}

function loadPosts() {
    let key = parseInt(localStorage.getItem("threadKey"));
    let tx = forumsDB.transaction(FORUMS_DB_NAME).objectStore(FORUMS_DB_NAME).get(key);
    tx.onsuccess = (e) => {
        let res = e.target.result;
        for (let i = 0; i < res.posts.length; i++) {
            let curr = res.posts[i];
            createPostElement(curr.author, curr.message);
        }
    }
}

function onPostStart() {
    initializeNavigation();
    setupLoginButton();
    document.getElementById("title").innerHTML = localStorage.getItem("threadTitle");

    if (permission === 0)
        document.getElementById('create-container').style.display = 'none'

    let req = window.indexedDB.open(FORUMS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        forumsDB = e.target.result;
        console.log("Forums DB loaded.")
        loadPosts();
    }
}

function start() {
    initializeNavigation();
    setupLoginButton();

    if (permission === 0)
        document.getElementById('create-thread').style.display = 'none'

    let req = window.indexedDB.open(FORUMS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        forumsDB = e.target.result;
        console.log("Forums DB loaded.")
        loadThreadsInTable();
    }
}