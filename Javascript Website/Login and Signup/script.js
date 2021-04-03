// access DOM through document. 
    // getElementById searches for your html tag by id
    // .value returns the input in your <input> tag
    // innerHTML will give you the string associated with that tag
    // in this example, the two <div> tags are blank (e.g. empty string), so
    // we are assigning our input as the value of these <div> tags 
function printDetails(){ 
    var Email = document.getElementById('Email').value;
    var Password = document.getElementById('Password').value;
    document.getElementById('submitted-username').innerHTML = Email;
    document.getElementById('submitted-pass').innerHTML = Password;
}

// based on the following conditions
// will return true if the username is:
// 1. contains the @ character
// 2. there is something before and after the @ character
// code below first gets the first index of the '@' character with indexOf (return -1 if none)
// check if index is not -1, if it is, check the characters before and after it
// we might also want to check if the username has the '.' character such as in 
// test@example.com, but this is easily adjustable later
function isValidUsername(Email) {
    var index = Email.indexOf('@');
    return index != -1 && 
    (Email.charAt(index+1) != '' && Email.charAt(index-1) != '');
}

// our conditions are:
// 1. passwords have a minimum of 6 characters
function isValidPassword(Password) {
    return Password.length >= 6;
}

// will give user an error if the username/password they 
// entered is incorrectly syntaxed
function parseForm() {
    var Email = document.getElementById('Email').value;
    var Password = document.getElementById('Password').value;
    var validityCheck = document.getElementById('validity-check');
    var color="f55142";
    if (!isValidUsername(Email)) 
        validityCheck.innerHTML = "Incorrect email format".fontcolor(color);
    else if (!isValidPassword(Password)) 
        validityCheck.innerHTML = "Incorrect email or password".fontcolor(color);
    else 
        validityCheck.innerHTML = "Proceed to check database";
}
