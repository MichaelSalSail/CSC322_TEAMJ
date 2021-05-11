let database;

function start() {
    let req = window.indexedDB.open(SYSTEMS_DB_NAME, VERSION);
    req.onsuccess = (e) => {
        console.log("Systems database loaded.");
        database = e.target.result;
    }
    setupLoginButton();
}

function toggleTabs() {
    let availableTab = document.getElementById('available-tab');
    let availableDisplay = document.getElementById('available-display');
    let pendingTab = document.getElementById('pending-tab');
    let pendingDisplay = document.getElementById('pending-display');
    let approvedTab = document.getElementById('approved-tab');
    let approvedDisplay = document.getElementById('approved-display');

    let isAvailableSelected = availableTab.disabled;
    let isPendingSelected = pendingTab.disabled;
    let isApprovedSelected = approvedTab.disabled;

    if (isAvailableSelected & isPendingSelected & !isApprovedSelected) 
    {
        availableTab.disabled = false;
        pendingTab.disabled = true;
        approvedTab.disabled = true;
        availableDisplay.style.display = 'block';
        pendingDisplay.style.display = 'none';
        approvedDisplay.style.display = 'none';
    } 
    else if (!isAvailableSelected & isPendingSelected & isApprovedSelected)
    {
        availableTab.disabled = true;
        pendingTab.disabled = false;
        approvedTab.disabled = true;
        availableDisplay.style.display = 'none';
        pendingDisplay.style.display = 'block';
        approvedDisplay.style.display = 'none';
    }
    else if (isAvailableSelected & !isPendingSelected & isApprovedSelected)
    {
        availableTab.disabled = true;
        pendingTab.disabled = true;
        approvedTab.disabled = false;
        availableDisplay.style.display = 'none';
        pendingDisplay.style.display = 'none';
        approvedDisplay.style.display = 'block';
    }
}