// for functions that are used multiple times through the site to reduce redundancy

// skip is an array with indices that correspond to which link to skip
// must be in least to greatest index order
function createLinks(skip) {
    let skipIndex = 0;
    let container = document.getElementById("links");
    for (let i = 0; i < LINK_NAMES.length; i++) {
        if (i === skip[skipIndex]) {
            console.log("Currently Skipping", LINK_NAMES[i], "where i is", i, "and skipIndex is", skipIndex);
            skipIndex++;
            continue;
        }
        let link = document.createElement('a');
        let newLine = document.createElement('br');
        container.appendChild(newLine);
        link.setAttribute('href', HREFS[i]);
        link.innerHTML = LINK_NAMES[i];
        container.appendChild(link);
    }
}

// call this one
function initializeNavigation() {
    let permission = parseInt(window.localStorage.getItem("permission"));

    const ACCOUNT_INFO = 1;
    const MARKETPLACE = 2;
    const SHOPPING_CART = 3;
    const FORUM = 4;
    const DELIVERY = 5;
    const ADMINISTRATIVE = 6;

    switch (permission) {
        case VISITOR:
            createLinks([ACCOUNT_INFO, SHOPPING_CART, DELIVERY, ADMINISTRATIVE]);
            break;
        case USER:
            createLinks([DELIVERY, ADMINISTRATIVE]);
            break;   
        case DELIVERER: 
            createLinks([MARKETPLACE, SHOPPING_CART, FORUM, ADMINISTRATIVE]);
            break;
        case MANU:
            createLinks([ADMINISTRATIVE]);
            break;
        case CLERK:
            createLinks([ADMINISTRATIVE]);
            break;
        case ADMIN:
            createLinks([]);
            break;
    }
}