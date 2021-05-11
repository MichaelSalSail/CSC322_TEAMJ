let isTableShowing = false;

function loadUserInfo() {
    let username = localStorage.getItem("username");
    let permission = localStorage.getItem("permission");
    let balance = localStorage.getItem("balance");

    document.getElementById('username').innerHTML += username;
    document.getElementById('usertype').innerHTML += PERMISSION_STRINGS[permission];
    document.getElementById('balance').innerHTML += balance
}

function loadPurchasesTable(){

}

function start() {
    initializeNavigation();
    loadUserInfo();
    loadPurchasesTable();
    document.getElementById("purchases-btn").addEventListener('click', () => {
        let table = document.getElementById('purchases');
        if (isTableShowing) {
            table.style.display = 'none';
            isTableShowing = false;
        }
        else {
            table.style.display = 'block'
            isTableShowing = true;
        }
        //document.getElementById
    })

}