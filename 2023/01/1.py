import re
d=["_","one","two","three","four","five","six","seven","eight","nine"]
s=open("input.txt").read().split("\n")
i=lambda a:str(d.index(a))if len(a)>1 else a
print(sum(int(r[0]+r[-1])for r in[re.findall("\d",l)for l in s]),sum(int(i(a[0])+i(a[-1]))for a in[re.findall("(?=(\d|"+'|'.join(d)+"))",l) for l in s]))