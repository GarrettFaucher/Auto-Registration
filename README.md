# TODO
* Enter CRNs
  * Autofill the CRN input
  * Make sure classes were registered for
  * Report back to the user how registration went
  * Backup classes
* Clean HTML
  * Indicate if running in background
* Document how to use
  * Make YouTube video on how to use plugin?
  * Detailed instructions
  * Git documentation


# popup.js
This file is the script running in the background of popup.html, and communicates via messages to background.js when certain events happen (run is clicked, etc.. anything that other pages have to know about). This script exists in the scope of popup.html, so for every popup on every tab there is a standalone popup.js - this is important later.

# background.js
This file continually runs in the background of the extension and listens for messages from popup.js and fires events based on those messages. Basically it is an "always-on" middle-man between popup.js and tabDriver.js. This file is needed since it is shared by all instances of our extension across all tabs, whereas popup.js exsists once per tab / popup window and all events in popup.js cancel as soon as the popup window is closed / loses focus - making background.js the correct place to sleep / wait / handle incoming events and pass messages to the tabDriver. This script is active so long as chrome is open, whereas popup.js is only active when the popup is open.

# tabDriver.js
This file is now injected into every \*.uvm.edu page, whether our extension created that page or not. This injected file waits for messages from background.js, and does things based on those messages. It is basically a listener. This means that if the user visits a \*.uvm.edu page on their own, our extension won't do anything on that page since background.js only passes messages to the tab that it creates. tabDriver now has a run() function which is fired when the "start" command is sent by background.js. run() is in charge of running the automations as a chain, and gets the returned boolean values from each automation. For this to work properly, tabDriver will now hold each automation as a function, instead of each automation being a seperate file.
