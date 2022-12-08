q=range
f=[[int(t)for t in l]for l in open("input.txt").read().split()]
h=len(f)
g=lambda y,x:[[f[k][x]for k in q(y)][::-1],[f[y][l]for l in q(x)][::-1],[f[k][x]for k in q(y+1,h)],[f[y][l]for l in q(x+1,h)]]
def v(t,g):
 h=[i for i in q(len(t))if t[i]>=g]
 return len(t[:h[0]+1]if len(h)>0 else t)
def s(y,x):
 u,l,d,r=[v(t,f[y][x])for t in g(y,x)]
 return u*l*d*r
r=[[a,b]for a in q(h)for b in q(h)]
print(sum(1 for a in r if 0 in a or h-1 in a or min(max(t)for t in g(*a))<f[a[0]][a[1]]),max(s(*a)for a in r))