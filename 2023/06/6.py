g=lambda t,d:sum(b*(int(t)-b)>int(d)for b in range(int(t)))
r=1
z=[l.split()[1:]for l in open("a")]
for a in zip(*z):r*=g(*a)
print(r,g(*["".join(l)for l in z]))