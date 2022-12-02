i=(require('fs').readFileSync('input.txt')+'').replace(/ /g,'').split('\n')
console.log(i.reduce((a,b)=>a+'  BXCYAZAXBYCZCXAYBZ'.indexOf(b)/2,0),
i.reduce((a,b)=>a+'  BXCXAXAYBYCYCZAZBZ'.indexOf(b)/2,0))