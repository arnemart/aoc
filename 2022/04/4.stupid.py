import re
print(*map(sum,zip(*[[a<=c<=d<=b or c<=a<=b<=d,b>=c and d>=a]for[a,b,c,d]in[map(int,re.split("\D",l,3))for l in open("input.txt")]])))