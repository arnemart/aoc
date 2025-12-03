x=lambda l,i=0,m=(0,0):m if len(l)==0 else x(l[1:],i+1,(i,l[0])if l[0]>m[1]else m)
def s(l,n):(a,b)=x(l[:len(l)-n+1]);return""if n==0 else str(b)+s(l[a+1:],n-1)
print([sum(int(s(a,d))for a in[[int(c)for c in l.strip()]for l in open("a")])for d in[2,12]])