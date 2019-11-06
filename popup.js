//popup.js for javascript event handling and data saving on the popup.html page

// When save is clicked on popup.html, collectData is called.
window.addEventListener('load', function load(event){
    var createButton = document.getElementById('save');
    createButton.addEventListener('click', function() { collectData(); });

    //listen for clicks on the "run" button
    var runButton = document.getElementById('run');
    runButton.addEventListener('click', event => {
      //when a click is detected, send a message to the background page
      console.log('sending click event to background page')
      chrome.runtime.sendMessage({event: 'runClick'}, function(response){

      });

    });
});

// collectData retrieves the filled in text boxes from the HTML display and
// populate input.json with the data gathered.
function collectData() {
     console.log("collectData called.");

     // Clear local storage
     chrome.storage.local.clear(function() {
          var error = chrome.runtime.lastError;
          if (error) {
               console.error(error);
          }
     });

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

     var crnData = [username, password, date, time, crn_1, crn_2, crn_3, crn_4, crn_5, crn_6, crn_7, crn_8];
     console.log(crnData); // Show the data for bug fixing

     chrome.storage.local.set({'username': username});
     chrome.storage.local.set({'password': password});
     chrome.storage.local.set({'date': date});
     chrome.storage.local.set({'time': time});
     chrome.storage.local.set({'crn_1': crn_1});
     chrome.storage.local.set({'crn_2': crn_2});
     chrome.storage.local.set({'crn_3': crn_3});
     chrome.storage.local.set({'crn_4': crn_4});
     chrome.storage.local.set({'crn_5': crn_5});
     chrome.storage.local.set({'crn_6': crn_6});
     chrome.storage.local.set({'crn_7': crn_7});
     chrome.storage.local.set({'crn_8': crn_8});
}
