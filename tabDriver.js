/*
  tabDriver.js

  Drives the whole login/registration process by running automations
  at specific times, or when specific events occur.

  Controls tabs, script injections, and reads information such as URL changes / page changes

  All automations are stored in /automations

  Calling this file automatically begins the course registration process
*/




export function driver(){
  console.log("TABDRIVER: driver() executed");
  var tabId;
  // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  //   console.log(tabs[0]);
  //   tabId = tabs[0].id;
  // });

  chrome.tabs.create({
    url: 'http://myuvm.uvm.edu'
  }, function(tab){
    tabId = tab.id;
    console.log('tab created');
    setTimeout(function(){
      chrome.tabs.executeScript(tabId, {file: './automations/login.js'},function(){
        console.log('script execution');
      })
    }, 1000);

  });




  //Attempt login with login.js

  //Run checkLogin.js

  //if logged in, navigate to registrar page

  //at specific time, run entryAttempt.js to try to get into course registration

  //when registration page url is detected, run classSignup.js to autofill CRNS and submit the form
}
// driver();
