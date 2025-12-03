x=lambda l,i=0,m=(0,0):m if l==[]else x(l[1:],i+1,(i,l[0])if l[0]>m[1]else m)
def s(l,n):(a,b)=x(l[:len(l)-n]);return str(b)+s(l[a+1:],n-1)if n>=0 else""
print([sum(int(s(a,d))for a in[[int(c)for c in l[:-1]]for l in open("a")])for d in[1,11]])