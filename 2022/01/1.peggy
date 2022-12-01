Max = head:Sum tail:("\n\n" Sum)* {
  const sorted = [head, ...tail.map(e => e[1])].sort((a, b) => b - a)
  return [sorted[0], sorted[0] + sorted[1] + sorted[2]]
}

Sum = head:Integer tail:("\n" Integer)* {
  return tail.reduce((a, b) => a + b[1], head)
}

Integer = [0-9]+ { return parseInt(text(), 10); }
