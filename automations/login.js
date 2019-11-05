/*
  Stage 1 of tabDriver.js
  Fill and submit the login form on uvm.edu
*/

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function login() {
     console.log("running login automation on login.js");

     var usernameInput = document.getElementsByName("username")[0];
     var passwordInput = document.getElementsByName("password")[0];
     var submitButton = document.getElementsByName("submit")[0];

     // TODO: Use chrome.local data to fill properly
     usernameInput.value="username";
     passwordInput.value="password";

     console.log('Waiting for page to load...');
     await sleep(2000);
     console.log('Page should have loaded.');
     submitButton.click();

}

login();
