v=50;a=b=0
for d in open("a"):
 for i in range(int(d[1:])):v=(v+{"L":-1,"R":1}[d[0]])%100;b+=v==0
 a+=v==0
print(a,b)