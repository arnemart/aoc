import re
print(*map(sum,zip(*[[a<=c<=d<=b or c<=a<=b<=d,not(b<c or a>d)]for[a,b,c,d]in[map(int,re.findall("\d+",l))for l in open("input.txt")]])))