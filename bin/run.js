let {Obfuscation} = require("../worker/obfuscation");

const path = require('path');
const fs = require('fs');


let checkcode = fs.readFileSync(path.resolve(__dirname, './check.js'), {encoding: "utf-8"});

let uselesscode = fs.readFileSync(path.resolve(__dirname, './useless.js'), {encoding: "utf-8"});


fs.readFile(path.resolve(__dirname, './origin.js'), {"encoding": 'utf-8'}, function (err, data) {
    global.parms = {
        useless: uselesscode,
        check: checkcode,
        code:data,
        mergeArr: ['md5', 'binlMD5'],
        structure: 'if',
        part: 'program func'
    }

    let ob = new Obfuscation()
    let result =  ob.obfuscate()
    console.log(result)

    fs.writeFile(path.resolve(__dirname, './result.js'), result, {encoding: 'utf8'}, err => {
    })
})