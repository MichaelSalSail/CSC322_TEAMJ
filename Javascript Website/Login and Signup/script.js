// create constant for database object here


// used for onload in html body
// initalize required variables here
function start() {
    console.log(document.getElementById('login-tab').disabled)
}

// based on the following conditions
// will return true if the username is:
// 1. contains the @ character
// 2. there is something before and after the @ character
// code below first gets the first index of the '@' character with indexOf (return -1 if none)
// check if index is not -1, if it is, check the characters before and after it
// we might also want to check if the username has the '.' character such as in 
// test@example.com, but this is easily adjustable later
function isValidEmail(email) {
    let index = email.indexOf('@');
    return index != -1 && (email.charAt(index+1) != '' && email.charAt(index-1) != '');
}

// our conditions are:
// 1. passwords have a minimum of 6 characters
// 2. both password and the confirmed password are the same
function isValidPassword(password, confirmPassword) {
    return password.length >= 6 && password === confirmPassword;
}

function registerUser() {
    let username = document.getElementById('username').value;
    let email = document.getElementById('reg-email').value;
    let password = document.getElementById('reg-password').value;
    let confirmPassword = document.getElementById('confirm-password').value

    var validityCheck = document.getElementById('validity-check');
    var color = "f55142";

    if (isValidPassword(password, confirmPassword) && isValidEmail(email)) 
    {
        // document.getElementById('validity-check').innerHTML
        validityCheck.innerHTML =  "Check if username is unique. Email not already registered";
    }
    else if (username.length<6)
    {   // throw text errors
        validityCheck.innerHTML = "Username must be minimum 6 characters".fontcolor(color);
    }
    else if (password.length<6)
    {   // throw text errors
        validityCheck.innerHTML = "Password must be minimum 6 characters".fontcolor(color);
    }
    else if (!isValidEmail(email))
    {
        validityCheck.innerHTML = "Email is incorrect format".fontcolor(color);
    }
    else
    {
        document.getElementById('validity-check').innerHTML = "Passwords do not match".fontcolor(color);
    }

}

function signInUser(){
    // query database for corresponding email + password
    let email = document.getElementById('log-email').value;
    let password = document.getElementById('log-password').value;
    var validityCheck = document.getElementById('validity-check');
    var color = "f55142";

    if (!isValidEmail(email)) 
        validityCheck.innerHTML = "Incorrect email format".fontcolor(color);
    else if (password.length < 6) 
        validityCheck.innerHTML = "Incorrect email or password".fontcolor(color);
    else 
        validityCheck.innerHTML = "Proceed to check database";
}

function parseForm() {
    isRegistering = document.getElementById('register-tab').disabled;
    if (isRegistering) 
        registerUser();
    else
        signInUser();    
}

// login button is disabled by default since it is the default tab
// checks which is selected and then toggles the button disable state
// changes style of each display to visible/none depending if the tab is selected
function toggleTabs() {
    let loginTab = document.getElementById('login-tab');
    let loginDisplay = document.getElementById('login-display');
    let registerTab = document.getElementById('register-tab');
    let registerDisplay = document.getElementById('register-display');
    
    let isLoginSelected = loginTab.disabled;

    if (isLoginSelected) {
        loginTab.disabled = false;
        registerTab.disabled = true;
        loginDisplay.style.display = 'none';
        registerDisplay.style.display = 'block';
    } else {
        loginTab.disabled = true;
        registerTab.disabled = false;
        loginDisplay.style.display = 'block';
        registerDisplay.style.display = 'none';
    }
}