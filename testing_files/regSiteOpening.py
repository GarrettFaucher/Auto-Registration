from datetime import datetime
from urllib.request import urlopen
from time import sleep
SLEEPAMOUNT = 15
keepGoing = True
lastStatus = 0
i = 0
file = open("downTimes.txt", mode='w')

while 1:
    with urlopen("https://aisweb1.uvm.edu/pls/owa_prod/bwskfreg.P_AddDropCrse") as conn:
        lastStatus = conn.status
        if(lastStatus != 200):
            now = datetime.now()
            file.write(now.strftime("%m/%d/%Y, %H:%M:%S") + "\n")
    i+=1
    print("Conn",str(i)+":",lastStatus)
    sleep(SLEEPAMOUNT)

file.close()
