i=(require('fs').readFileSync('input.txt')+'').replace(/ /g,'').split('\n')
console.log(i.reduce((a,b)=>a+{AX:4,AY:8,AZ:3,BX:1,BY:5,BZ:9,CX:7,CY:2,CZ:6}[b],0),
i.reduce((a,b)=>a+{AX:3,AY:4,AZ:8,BX:1,BY:5,BZ:9,CX:2,CY:6,CZ:7}[b],0))