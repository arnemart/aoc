def f(l,n):
 a=max(l[:len(l)-n])
 while l[0]!=a:l=l[1:]
 return a if n<1 else a+f(l[1:],n-1)
[print(sum(int(f(l.strip(),n))for l in open("a")))for n in[1,11]]