s=open("input.txt").read();i=0;d=4
while 1:
 i+=1
 if len(set(s[i:i+d]))==d:print(i+d);d=14