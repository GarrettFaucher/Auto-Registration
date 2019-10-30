// script.js started to store the data from the html drop down
// into a JSON for webdriver to use.

// When save is clicked on popup.html, collectData is called.
window.addEventListener('load', function load(event){
    var createButton = document.getElementById('save');
    createButton.addEventListener('click', function() { collectData(); });
});

// collectData retrieves the filled in text boxes from the HTML display and
// populate input.json with the data gathered.
function collectData() {
     console.log("collectData called.");
     // Store the data from each textbox
     var crn_1 = document.getElementById('crn_1').value;
     var crn_2 = document.getElementById('crn_2').value;
     var crn_3 = document.getElementById('crn_3').value;
     var crn_4 = document.getElementById('crn_4').value;
     var crn_5 = document.getElementById('crn_5').value;
     var crn_6 = document.getElementById('crn_6').value;
     var crn_7 = document.getElementById('crn_7').value;
     var crn_8 = document.getElementById('crn_8').value;
     var username = document.getElementById('username').value;
     var password = document.getElementById('password').value;

     // Put it in a vector to loop through
     var crnData = [crn_1, crn_2, crn_3, crn_4, crn_5, crn_6, crn_7, crn_8, username, password];
     console.log(crnData); // Show the data for bug fixing
     // Loop through vector and stor it in local Chrome storage
     for(var i = 0; i < crnData.length; i++) {
          var currentKey = "crn_" + (i+1);
          chrome.storage.local.set({currentKey: crnData[i]}, (function(crnData) {
               console.log('Value is set to ' + crnData[i]);
          })(crnData));
     }
}
