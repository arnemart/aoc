g={}
p=()
for c in open("input.txt"):
 d,e,*f=c.split()
 if e=="cd":p=p[:-1]if c[5]=="."else(*p,*f)
 if d.isdigit():
  for i in range(len(p)):g[p[:i+1]]=int(d)+g.get(p[:i+1],0)
print(sum(g[f]for f in g if g[f]<1e5),min(g[f]for f in g if g[f]>g[("/",)]-4e7))