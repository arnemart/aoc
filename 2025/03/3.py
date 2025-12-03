def f(l,n):
 a=max(l[:len(l)-n+1])
 while l[0]!=a:l=l[1:]
 return a if n<2 else a+f(l[1:],n-1)
print([sum(int(f(l.strip(),n))for l in open("a"))for n in[2,12]])