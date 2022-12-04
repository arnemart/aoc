import re
print(*map(sum,zip(*[[a<=c<=d<=b or c<=a<=b<=d,any([c<=a<=d,c<=b<=d,a<=c<=b,a<=d<=b])]for[a,b,c,d]in[map(int,re.findall("\d+",l))for l in open("input.txt")]])))