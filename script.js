// This .js file started to store the data from the html drop down
// into a JSON for webdriver to use.

window.addEventListener('load', function load(event) {
     document.getElementById('send').onclick = function() {
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
     var data = {crn_1: crn_1, crn_2: crn_2, crn_3: crn_3, crn_4: crn_4,
                crn_5: crn_5, crn_6: crn_6, crn_7: crn_7, crn_8: crn_8,
                username: username, password: password};
     var jsonData = JSON.stringify(data),
          filename = 'input.json',
          blob = new Blob([jsonData], {type: "text/plain;charset=utf-8"});

     saveAs(blob, filename);
});
