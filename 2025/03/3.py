def f(l,n):a=max(l[:-n]);return a if n<2 else a+f(l.split(a,1)[1],n-1)
[print(sum(int(f(l,n))for l in open("a")))for n in[2,12]]