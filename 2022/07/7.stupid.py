g={}
p=()
for c in open("input.txt"):
 d,e,*f=c.split()
 if e=="cd":p=p[:-1]if c[5]=="."else(*p,*f)
 if c[0].isdigit():
  s=int(d)
  for i in range(len(p)):g[p[:i+1]]=s+g.get(p[:i+1],0)
v=g.values()
print(sum(f for f in v if f<1e5),min(f for f in v if f>g[("/",)]-4e7))