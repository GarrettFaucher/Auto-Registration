/*
  Stage 1 of tabDriver.js
  Fill and submit the login form on uvm.edu
*/

console.log("running login automation on login.js");

var usernameInput = document.getElementsByName("username")[0];
var passwordInput = document.getElementsByName("password")[0];

usernameInput.value="username";
passwordInput.value="password";
