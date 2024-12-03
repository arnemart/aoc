import re
s=open("a").read()
print([sum(int(a)*int(b)for a,b in re.findall(r"l\((\d+),(\d+)\)",x))for x in[s,re.sub(r"(?s)'t.*?do\(","",s)]])