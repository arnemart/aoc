p=[int(l[1:])*{"L":-1,"R":1}[l[0]]for l in open("a").read().split()]
s=50;z=0;x=0
for n in p:j=s+n;x+=j==0 or abs(j)//100+(j<0 and s!=0);s=j%100;z+=s==0
print(z,x)