c,m=open("input.txt").read().split("\n\n")
for r in 1,0:
 s=[0]+[[l[i]for l in c.split("\n")[:-1]if l[i]!=" "]for i in range(1,34,4)]
 for n,f,t in(map(int,d.split()[1:6:2])for d in m.split("\n")):l,s[f]=s[f][:n],s[f][n:];s[t]=[l,l[::-1]][r]+s[t]
 print("".join(a[0]for a in s[1:]))