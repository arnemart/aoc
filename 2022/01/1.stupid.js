const { readFileSync } = require('fs')
console.log(eval(`Math.max(${readFileSync('input.txt').toString().replace(/\n\n/g, ',').replace(/\n/g, '+')})`))
