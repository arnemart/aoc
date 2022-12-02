i=open("input.txt").read().replace(" ","").split()
print(sum("  BXCYAZAXBYCZCXAYBZ".find(x)/2 for x in i),
sum("  BXCXAXAYBYCYCZAZBZ".find(x)/2 for x in i))