r=[[(0,0)]for _ in range(10)]
for l in open("a"):
 for _ in range(int(l[2:])):
  x,y=r[0][-1];r[0]+=[{"U":(x,y-1),"D":(x,y+1),"L":(x-1,y),"R":(x+1,y)}[l[0]]];p=r[0][-1]
  for t in r[1:]:c=t[-1][0];d=t[-1][1];e=p[0]-c;f=p[1]-d;q=abs(f)==2;w=abs(e)==2;t+=[(c+[[0,e][q],e/2][w],d+[[0,f][w],f/2][q])];p=t[-1]
[print(len(set(r[a])))for a in[1,9]]