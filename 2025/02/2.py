import re
print([sum(n for n in sum([[*range(*[*map(int,s.split("-"))])]for s in open("a").read().split(",")],[])if re.match("^(\\d+)\\1%s$"%r,str(n)))for r in["","+"]])