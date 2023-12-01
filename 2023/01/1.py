z=s=open("a").read()
for i,j in enumerate("on tw hre ou fi si sev ei ni".split(),1):z=z.replace(j,str(i)+j)
print([sum(int(r[0]+r[-1])for r in"".join(c for c in g if c<"a").split("\n"))for g in[s,z]])