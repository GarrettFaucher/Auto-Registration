# Used to input CRN data into UVM webpage.
# Logs into UVM website and opens CRN page.

import time
import json
from selenium import webdriver

# I forget how Python works and this main func might be broken lmao
def main():
    inputFile = open('input.json', 'r')
    jsonDecode = json.load(inputFile)
    inputData = []

    for item in jsonDecode:
        myDict = {}
        print(myDict)
        inputData.append(myDict)

    username = inputData[8]
    password = inputData[9]

    driver = webdriver.Chrome()  # Optional argument, if not specified will search path.
    driver.get('https://myuvm.uvm.edu/web/home-community/registrar?p_p_id=56_INSTANCE_UHUqm6dYpw1z&p_p_lifecycle=0&p_p_state=maximized&p_p_col_id=column-1&p_p_col_pos=1&p_p_col_count=3&link_id=18');
    user = driver.find_element_by_name('username')
    user.send_keys(username)
    passw = driver.find_element_by_name('password')
    passw.send_keys(password)
    passw.submit()
    driver.quit()

main()
