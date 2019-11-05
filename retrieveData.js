// script.js started to store the data from the html drop down
// into a JSON for webdriver to use.

import {tabDriver} from './tabDriver.js'

// When save is clicked on popup.html, collectData is called.
window.addEventListener('load', function load(event){
    var createButton = document.getElementById('save');
    createButton.addEventListener('click', function() { collectData(); });

    var runButton = document.getElementById('run');
    runButton.addEventListener('click', event => {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        tabDriver();
        // var currentTab = tabs[0].id;
        // chrome.tabs.executeScript(currentTab, {file: './tabDriver.js'},function(){
        //
        // })
      });

    });
});

// collectData retrieves the filled in text boxes from the HTML display and
// populate input.json with the data gathered.
function collectData() {
     console.log("collectData called.");
     // Store the data from each textbox
     var username = document.getElementById('username').value;
     var password = document.getElementById('password').value;
     var date = document.getElementById('reg_date').value; // Date stored in format YYYY-MM-DD
     // Possible values for time: 600am, 630am, 700am
     var time = document.getElementById('reg_time').value;
     var crn_1 = document.getElementById('crn_1').value;
     var crn_2 = document.getElementById('crn_2').value;
     var crn_3 = document.getElementById('crn_3').value;
     var crn_4 = document.getElementById('crn_4').value;
     var crn_5 = document.getElementById('crn_5').value;
     var crn_6 = document.getElementById('crn_6').value;
     var crn_7 = document.getElementById('crn_7').value;
     var crn_8 = document.getElementById('crn_8').value;

     // Put it in a vector to loop through
     var crnData = [username, password, date, time, crn_1, crn_2, crn_3, crn_4, crn_5, crn_6, crn_7, crn_8];
     console.log(crnData); // Show the data for bug fixing
     // Loop through vector and store it in local Chrome storage
     var currentKey;
     for(var i = 0; i < crnData.length; i++) {
          if (i <= 3) {
               if (i == 0)      {currentKey = "username";}
               else if (i == 1) {currentKey = "password";}
               else if (i == 2) {currentKey = "date";}
               else if (i == 3) {currentKey = "time";}
          } else {
               currentKey = "crn_" + (i - 1);
          }
          // Storing the data in local chrome storage
          chrome.storage.local.set({currentKey: crnData[i]}, (function(crnData) {
               console.log(currentKey + ' is set to ' + crnData[i]);
          })(crnData));
     }
}
