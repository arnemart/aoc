s=open("input.txt").read();i=0
for d in 4,14:
 while 1:
  i+=1
  if len(set(s[i:i+d]))==d:print(i+d);break