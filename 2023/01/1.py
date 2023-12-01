import re
z=s=open("input.txt").read()
for i,j in enumerate(["_","one","two","three","four","five","six","seven","eight","nine"]):z=re.sub(j,lambda m:m[0]+str(i)+m[0],z)
print([sum(int(r[0]+r[-1])for r in re.sub("[a-z]","",g).split("\n"))for g in[s,z]])