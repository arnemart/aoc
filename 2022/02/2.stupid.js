i=(require('fs').readFileSync('input.txt')+'').replace(/ /g,'').split('\n')
console.log(eval(i.map(x=>({AX:4,AY:8,AZ:3,BX:1,BY:5,BZ:9,CX:7,CY:2,CZ:6}[x])).join('+')),
eval(i.map(x=>({AX:3,AY:4,AZ:8,BX:1,BY:5,BZ:9,CX:2,CY:6,CZ:7}[x])).join('+')))