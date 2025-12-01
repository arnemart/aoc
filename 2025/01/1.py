p=[(int(l[1:]),l[0])for l in open("a").read().split()]
v=50;a=0;b=0
for d,r in p:
 for i in range(d):v=(v+{"L":-1,"R":1}[r])%100;b+=v==0
 a+=v==0
print(a,b)