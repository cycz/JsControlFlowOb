const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const generator = require("@babel/generator").default;

const {traverse_ProgramControlFlow,traverse_funcControlFlow} = require('../visitors/ControlFlow.js');


class Obfuscation {


    obfuscate() {
        let code = global.parms.code
        return this.controlFlow(code)
    }

    controlFlow(code) {
        const ast = parser.parse(code)
        if (global.parms['part'].indexOf('func')>=0){
            traverse(ast, traverse_funcControlFlow)
        }
        if (global.parms['part'].indexOf('program')>=0){
            traverse(ast, traverse_ProgramControlFlow)
        }

        let resultCode = generator(ast).code
        console.log(resultCode)
        return resultCode
    }

}



exports.Obfuscation = Obfuscation