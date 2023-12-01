import re
z=s=open("a").read()
for i,j in enumerate(["on","tw","hre","ou","fi","si","sev","ei","ni"],1):z=re.sub(j,lambda m:str(i)+m[0],z)
print([sum(int(r[0]+r[-1])for r in re.sub("[a-z]","",g).split("\n"))for g in[s,z]])