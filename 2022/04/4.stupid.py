import re
print(list(map(sum,zip(*[[a<=c and b>=d or c<=a and d>=b,any([c<=a<=d,c<=b<=d,a<=c<=b,a<=d<=b])]for[a,b,c,d]in[map(int,re.findall("\d+",l))for l in open("input.txt")]]))))