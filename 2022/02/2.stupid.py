i=open("input.txt").read().replace(" ","").split()
print(sum(["","BX","CY","AZ","AX","BY","CZ","CX","AY","BZ"].index(x) for x in i),
sum(["","BX","CX","AX","AY","BY","CY","CZ","AZ","BZ"].index(x) for x in i))