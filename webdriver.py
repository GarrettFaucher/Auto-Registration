import time
from selenium import webdriver

username = "xd"
password = "LOL NO"

driver = webdriver.Chrome()  # Optional argument, if not specified will search path.
driver.get('https://myuvm.uvm.edu/web/home-community/registrar?p_p_id=56_INSTANCE_UHUqm6dYpw1z&p_p_lifecycle=0&p_p_state=maximized&p_p_col_id=column-1&p_p_col_pos=1&p_p_col_count=3&link_id=18');
user = driver.find_element_by_name('username')
user.send_keys(username)
passw = driver.find_element_by_name('password')
passw.send_keys(password)
passw.submit()
add_drop = driver.find_elements_by_xpath("//input[@href=]")
driver.quit()
