from urllib.request import urlopen
from time import sleep
SLEEPAMOUNT = 1
keepGoing = True
lastStatus = 0
i = 0

while keepGoing:
    with urlopen("https://myuvm.uvm.edu") as conn:
        lastStatus = conn.status
        if(lastStatus != 200):
             keepGoing = False
    i+=1
    print("Conn",str(i)+":",lastStatus)
    # sleep(SLEEPAMOUNT)


print("Failure on attempt",i)
