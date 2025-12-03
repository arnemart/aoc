def f(l,n):a=max(l[:-n-1]);return a if n<1 else a+f(l.split(a,1)[1],n-1)
[print(sum(int(f(l,n))for l in open("a")))for n in[1,11]]