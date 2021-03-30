// access DOM through document. 
    // getElementById searches for your html tag by id
    // .value returns the input in your <input> tag
    // innerHTML will give you the string associated with that tag
    // in this example, the two <div> tags are blank (e.g. empty string), so
    // we are assigning our input as the value of these <div> tags 
function printDetails(){ 
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    document.getElementById('submitted-username').innerHTML = username;
    document.getElementById('submitted-pass').innerHTML = password;
}

// based on the following conditions
// will return true if the username is:
// 1. contains the @ character
// 2. there is something before and after the @ character
// code below first gets the first index of the '@' character with indexOf (return -1 if none)
// check if index is not -1, if it is, check the characters before and after it
// we might also want to check if the username has the '.' character such as in 
// test@example.com, but this is easily adjustable later
function isValidUsername(username) {
    var index = username.indexOf('@');
    return index != -1 && 
    (username.charAt(index+1) != '' && username.charAt(index-1) != '');
}

// our conditions are:
// 1. passwords have a minimum of 6 characters
function isValidPassword(password) {
    return password.length >= 6;
}

// will give user an error if the username/password they 
// entered is incorrectly syntaxed
function parseForm() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var validityCheck = document.getElementById('validity-check');
    if (isValidUsername(username) && isValidPassword(password)) 
        validityCheck.innerHTML = "valid details";
    else validityCheck.innerHTML = "invalid details";
}
