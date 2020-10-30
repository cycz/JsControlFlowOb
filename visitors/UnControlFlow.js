/*****************************************************
 *
 * if检测多分枝控制流插件
 * Author:cyz
 * Date:2020.10.14
 * Version:V1.0
 * github:https://github.com/cycz
 * 欢迎star 提bug
 *****************************************************/
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const generator = require("@babel/generator").default;
// import {Random} from '../util/random';
const {Random} = require('../util/random.js');


const path = require('path');
const fs = require('fs');

function randomNode(code, num) {
    let body = code.program.body;
    let length = body.length
    if (length < 1) {
        return
    }
    var old_arry = body,
        range = num;
    //防止超过数组的长度
    range = range > old_arry.length ? old_arry.length : range;
    var newArray = [].concat(old_arry), //拷贝原数组进行操作就不会破坏原数组
        valArray = [];
    for (var n = 0; n < range; n++) {
        var r = Math.floor(Math.random() * (newArray.length));
        valArray.push(newArray[r]);
        //在原数组删掉，然后在下轮循环中就可以避免重复获取
        newArray.splice(r, 1);
    }
    return valArray;
}

// let jscode = fs.readFileSync(path.resolve(__dirname, './check.js'), {encoding: "utf-8"});
// checkCode = parser.parse(jscode)
// checkArr = randomNode(checkCode, checkCode.program.body.length);
//
// let useless = fs.readFileSync(path.resolve(__dirname, './useless.js'), {encoding: "utf-8"});
//
//
// // fs.readFile(path.resolve(__dirname, './check.js'), {"encoding": 'utf-8'}, function (err, data) {
// //     checkCode = parser.parse(data)
// //     checkArr = randomNode(checkCode, checkCode.program.body.length);
// //
// // })
// fs.readFile(path.resolve(__dirname, './origin.js'), {"encoding": 'utf-8'}, function (err, data) {
//     const ast = parser.parse(data)
//     // traverse(ast, traverse_controlFlow)
//     parms = {
//         'mergeArr': ['a', 'b'],
//         'structure': 'if',
//         'check': jscode,
//         'useless' :useless
//     }
//     // traverse(ast, traverse_funcControlFlow)
//     traverse(ast, traverse_controlFlow)
//     traverse(ast, traverse_funcControlFlow)
//
//     // step1(ast)
//     let {code} = generator(ast)
//     console.log(code)
//     fs.writeFile(path.resolve(__dirname, './result.js'), code, {encoding: 'utf8'}, err => {
//     })// })

const traverse_ProgramControlFlow = {
    Program(path) {
        if (!this.parms) {
            return
        }
        ProgramFlow(path, parms)
    }
}

const traverse_funcControlFlow = {
    Program(path) {
        if (!this.parms) {
            return
        }
        FuncFlow(path, parms)
    }
}


function randomWord(count) {
    var str = "",
        range = count,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    // if(randomFlag){
    //     range = Math.round(Math.random() * (max-min)) + min;
    // }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

function randomParamName(path, paramPool) {
    while (1) {
        let name = '_$$' + randomWord(2)
        let bd = path.scope.getBinding(name)
        if (bd === undefined && paramPool.indexOf(name) < 0) {
            paramPool.push(name)
            return name
        }
    }
}

function Flow(node, left, right) {
    this.node = node;
    this.left = left;
    this.right = right;
    this.ifJudge = undefined;
    this.funcName = 'Program';
    // this.nowFuncName = 'Program';
    this.trueRoad = 'left';
}

function funcflowNode(funcName, flow, startIndex) {
    this.funcName = funcName;
    this.flow = flow;
    this.startIndex = startIndex;
}

function FuncFlow(path, parms) {
    mergeArr = parms['mergeArr']
    funcNodeArr = []
    for (o of path.node.body) {
        if (types.isFunctionDeclaration(o)) {
            if (!types.isIdentifier(o.id)) {
                continue
            }
            let funcName = o.id.name
            if (mergeArr.indexOf(funcName) >= 0) {
                funcNodeArr.push(o)
            }
        }
    }
    if (funcNodeArr.length === 0) {
        return;
    }

    let useless = parmsNode(parms, 'useless')
    let check = parmsNode(parms, 'check')

    let uselessArr = Random.randomNode(useless);
    let checkArr = Random.randomNode(check);

    //获取最多参数值
    let maxParamsCount = 0
    for (let o of funcNodeArr) {
        if (o.params.length > maxParamsCount) {
            maxParamsCount = o.params.length
        }
    }
    let paramsNameArr = []
    let paramPool = []

    //加1是初始坐标的参数
    for (i = 0; i < maxParamsCount + 1; i++) {
        paramsNameArr.push(randomParamName(path, paramPool))
    }

    path.traverse({
            FunctionDeclaration: function (_path) {
                let {node} = _path
                if (mergeArr.indexOf(node.id.name) < 0) {
                    return
                }
                let _scope = _path.scope
                for (let i = 0; i < node.params.length; i++) {
                    _scope.rename(node.params[i].name, paramsNameArr[i + 1]);
                }
            }
        }
    )
    // console.log(path.toString())
    // let indexName = 'nownode'
    let indexName = paramsNameArr[0]
    //控制流内检测点名称
    // let flowCheckName = 'checkName'
    let flowCheckName = randomParamName(path, paramPool)
    //ifsta中test名称
    // let testnodeName = 'testnodeName'
    let testnodeName = randomParamName(path, paramPool)
    //path数组名称
    // let pathx = 'path'
    let pathx = randomParamName(path, paramPool)
    // let resultFuncName = randomParamName(path, paramPool)
    let flowArr = []
    let nextStartIndex = 0
    let flowMain = undefined;
    let bakFlow = undefined;
    let inlinefunarr = []

    let flowLast = undefined

    for (let o of funcNodeArr) {
        let isLastFunc = false
        let _body = o.body.body
        let funcName = o.id.name
        // allUselessArr = []
        // checkArr = []
        // [flowMain,bakflow]
        // let flow = initFuncFlow(_body, allUselessArr, checkArr, flowCheckName, indexName, inlinefunarr,isLastFunc);
        //main, allUselessArr, checkArr, checkName, inlinefunarr, funcName, isLastFunc
        // main, allUselessArr, checkArr, checkName, inlinefunarr, funcName, isLastFunc
        let flow_unpack = initFuncFlow(_body, uselessArr, checkArr, flowCheckName, inlinefunarr, funcName, isLastFunc);
        let flow = flow_unpack[0]
        flowLast = flow_unpack[1]
        let flowNode = new funcflowNode(o.id.name, flow, nextStartIndex)
        console.log(funcName + ' : ' + JSON.stringify(flow))

        flowArr.push(flowNode)

        nextStartIndex = stepCount(flow, 0) + 1
        console.log(funcName + 'step : ' + nextStartIndex)
        if (!flowMain) {
            flowMain = flow
            bakFlow = flowLast
        } else {
            bakFlow.left = flow
            bakFlow = flowLast
        }
    }
    // a = path.scope.getProgramParent()
    let nodecount = stepCount(flowMain, 0) + 1
    var indexArr = Random.ints(0, nodecount - 1)
    addindexs(flowMain, indexArr, flowCheckName, indexName)

    console.log('main' + ' : ' + JSON.stringify(flowMain))


    let pathArr = new Array()
    let nodeDict = new Object()
    let nextFuncstartNode = flowMain

    do {
        nextFuncstartNode = getPathArr(nextFuncstartNode, pathArr, nodeDict, nextFuncstartNode.funcName, undefined);
    } while (nextFuncstartNode)
    let eles = []
    for (i of pathArr) {
        eles.push(types.numericLiteral(i))
    }


    let indexNameNode = types.identifier(paramsNameArr[0])
    let pathNameNode = types.identifier(pathx)
    let testnodeNameNode = types.identifier(testnodeName)
    let flowsta = undefined
    if (parms['structure'] === 'switch') {
        flowsta = parseFlow2Switch(testnodeNameNode, nodeDict)
    } else {
        flowsta = parseFlow2IF(flowMain, testnodeName, nodeDict)
    }


    let var_patharrnode = types.variableDeclaration('var', [types.variableDeclarator(pathNameNode, types.arrayExpression(eles))])
    // let var_indexNameNode = types.variableDeclaration('var', [types.variableDeclarator(indexNameNode, types.numericLiteral(0))])
    let testNode = types.assignmentExpression('=', testnodeNameNode, types.memberExpression(pathNameNode, types.updateExpression('++', indexNameNode), true))
    let whileNode = types.whileStatement(test = types.numericLiteral(1), body = types.blockStatement([types.expressionStatement(testNode), flowsta]))
    // path.get('body')[0].insertBefore(whileNode)
    // path.get('body')[0].insertBefore(var_patharrnode)
    // path.get('body')[0].insertBefore(var_indexNameNode)
    funcbody = []
    // funcbody.push(var_indexNameNode)
    funcbody.push(var_patharrnode)
    funcbody.push(whileNode)
    paramsIdenti = []
    for (i of paramsNameArr) {
        paramsIdenti.push(types.identifier(i))
    }
    // let tes1234 = types.identifier(path.scope.generateUid('_$$a'))

    let funcNameIden = types.identifier(randomParamName(path, paramPool))
    let testfun = types.functionDeclaration(id = funcNameIden, paramsIdenti, body = types.blockStatement(inlinefunarr.concat(funcbody)))


    let funcflowNodeDict = parseFuncFlowNodeDict(flowArr)
    let filterBody = filterMergeFunc(path.node.body, Object.keys(funcflowNodeDict))
    path.node.body = filterBody.concat(testfun)

    path.traverse({
            CallExpression: function (_path) {
                let _node = _path.node
                // try {
                funcFlow = funcflowNodeDict[_node.callee.name]
                if (funcFlow === undefined) {
                    return;
                }
                _node.callee.name = funcNameIden.name
                _node.arguments = [types.numericLiteral(funcFlow.startIndex)].concat(_node.arguments)
                // }catch(exception){
                //     return;
                // }


            }
        }
    )

    // console.log(1)


    return;


}

function filterMergeFunc(body, nameArr) {
    let retArr = []
    for (let o of body) {
        if (types.isFunctionDeclaration(o)) {
            if (nameArr.indexOf(o.id.name) >= 0) {
                continue
            }
        }
        retArr.push(o)
    }
    return retArr
}


function parseFuncFlowNodeDict(FuncFlowArr) {
    adict = {}
    for (o of FuncFlowArr) {
        adict[o.funcName] = o
    }
    return adict
}

/**
 * parms
 * @param path isuseless ispoison
 * @param parms
 * @constructor
 */

function ProgramFlow(path, parms) {
    let {node} = path
    let body = node.body
    let length = body.length
    if (length < 1) {
        return
    }
    let paramPool = []
    let funarr = []

    let useless = parmsNode(parms, 'useless')
    // let poison = parmsNode(parms, 'poison')
    let check = parmsNode(parms, 'check')

    let uselessArr = Random.randomNode(useless);
    // let poisonArr = Random.randomNode(poison);
    let checkArr = Random.randomNode(check);

    body = filterFunc(body, funarr)
    //当前坐标名称
    // let indexName = 'nownode'
    let indexName = randomParamName(path, paramPool)
    //控制流内检测点名称
    // let flowCheckName = 'checkName'
    let flowCheckName = randomParamName(path, paramPool)
    //ifsta中test名称
    // let testnodeName = 'testnodeName'
    let testnodeName = randomParamName(path, paramPool)
    //path数组名称
    // let pathx = 'path'
    let pathx = randomParamName(path, paramPool)


    let flow = initFlow(body,  uselessArr, checkArr, flowCheckName, indexName, funarr);
    // console.log(stepCount(flow, 0))
    let pathArr = new Array()
    let nodeDict = new Object()
    getPathArr(flow, pathArr, nodeDict, 'Program')
    let eles = []
    for (i of pathArr) {
        eles.push(types.numericLiteral(i))
    }


    // let ifsta = parseFlow2IF(flow, testnodeName, nodeDict)
    let flowsta = undefined;
    let indexNameNode = types.identifier(indexName)
    let pathNameNode = types.identifier(pathx)
    let testnodeNameNode = types.identifier(testnodeName)

    if (parms['structure'] === 'switch') {
        flowsta = parseFlow2Switch(testnodeNameNode, nodeDict)
    } else {
        flowsta = parseFlow2IF(flow, testnodeName, nodeDict)
    }

    let var_patharrnode = types.variableDeclaration('var', [types.variableDeclarator(pathNameNode, types.arrayExpression(eles))])
    let var_indexNameNode = types.variableDeclaration('var', [types.variableDeclarator(indexNameNode, types.numericLiteral(0))])
    let testNode = types.assignmentExpression('=', testnodeNameNode, types.memberExpression(pathNameNode, types.updateExpression('++', indexNameNode), true))
    let whileNode = types.whileStatement(test = types.numericLiteral(1), body = types.blockStatement([types.expressionStatement(testNode), flowsta]))
    // path.get('body')[0].insertBefore(whileNode)
    // path.get('body')[0].insertBefore(var_patharrnode)
    // path.get('body')[0].insertBefore(var_indexNameNode)
    funarr.push(var_indexNameNode)
    funarr.push(var_patharrnode)
    funarr.push(whileNode)


    if (parms['structure'] === 'switch') {
        let fun = types.functionExpression(null, [], types.blockStatement(funarr))
        let 自执行 = types.expressionStatement(types.unaryExpression('!', types.callExpression(fun, [])))
        path.node.body = [自执行]
    } else {
        path.node.body = funarr
    }

    return;
    // console.log(1)

}


function checkNode() {
    this.name = undefined;
    this.ProgramOrFunc = '';
    this.funcName = '';
    this.row = '-1';
    this.trueRoad = '-1';
    this.blockNode = undefined;
}

function parseCheckNode(checkArr) {
    let checkIndexDict = {}
    let randomCheckArr = []
    for (o of checkArr) {
        let _checkNode = new checkNode()
        _checkNode.blockNode = o
        for (_o of o.body) {
            // console.log(1)
            if (types.isExpressionStatement(_o) &&
                types.isAssignmentExpression(_o.expression) &&
                types.isMemberExpression(_o.expression.left) &&
                types.isThisExpression(_o.expression.left.object)
            ) {
                let key = _o.expression.left.property.name
                let value = _o.expression.right.value
                if (key === 'name') {
                    _checkNode.name = value
                } else if (key === 'ProgramOrFunc') {
                    _checkNode.ProgramOrFunc = value
                } else if (key === 'funcName') {
                    _checkNode.funcName = value
                } else if (key === 'row') {
                    if (value === '0') {
                        value = '-1'
                    }
                    _checkNode.row = value
                } else if (key === 'trueRoad') {
                    _checkNode.trueRoad = value
                }
            }
        }
        if (_checkNode.row !== '-1') {
            checkIndexDict[_checkNode.row] = _checkNode
        } else {
            randomCheckArr.push(o)
        }
    }
    checkArr = randomCheckArr;
    return [checkIndexDict, checkArr]
}


function initCheckFlow(checkBabelNode, inlinefunarr, checkName, bakflow, trueRoad, funcName) {
    // let checkBabelNode = checkArr.pop()
    if (types.isBlockStatement(checkBabelNode)) {
        let _arr = checkBabelNode.body
        let ifbabel = undefined
        for (_item of _arr) {
            if (types.isFunctionDeclaration(_item)) {
                inlinefunarr.push(_item)
            } else if (types.isIfStatement(_item)) {
                ifbabel = _item
            }
        }
        if (ifbabel) {
            if (!trueRoad) {
                let trueFirst = randomBol(0.7)
                if (trueFirst) {
                    bakflow.trueRoad = 'right'
                }
            } else {
                bakflow.trueRoad = trueRoad
            }

            // bakflow.trueRoad = 'right'

            let rbabelNode = ifbabel.test
            let judge = randomifJudge(rbabelNode, checkName)
            bakflow.ifJudge = judge;
            addAllFlow(bakflow, ifbabel.consequent.body, funcName)
        }
    }
}

function getCheckFlag(flowindex, FunorProgram, funName, checkIndexDict) {
    if (Object.keys(checkIndexDict).indexOf(flowindex.toString()) < 0) {
        return false
    }
    if (FunorProgram === 'Program') {
        return true
    }
    let checkNode = checkIndexDict[flowindex]
    let hopefuncName = checkNode.funcName
    if (hopefuncName === funName) {
        return true
    }
    return !hopefuncName

}

function initFuncFlow(main, allUselessArr, checkArr, checkName, inlinefunarr, funcName, isLastFunc) {
    let flowMain = new Flow();
    let babelNode = undefined
    // let all = main.concat(poisonArr).concat(uselessArr)
    //带坐标的蜜罐
    var [checkIndexDict, checkArr] = parseCheckNode(checkArr)
    let flowiter = main[Symbol.iterator]()
    let flowindex = 1

    let uselessindex = 0
    flowMain.node = new FlowNode(flowiter.next().value)
    let bakflow = flowMain
    while (1) {
        if (flowindex === main.length) {
            let leftFlow = new Flow(new FlowNode(types.returnStatement()))
            leftFlow.funcName = funcName
            bakflow.left = leftFlow
            bakflow = leftFlow
            break
        }
        // if (flowindex === main.length - 1) {
        //     var r = (5 + Math.random() * 5) / 10;
        // } else {
        var r = Math.random();
        // }
        babelNode = flowiter.next().value
        let leftFlow = new Flow(new FlowNode(babelNode))
        bakflow.left = leftFlow

        let checkFlag = getCheckFlag(flowindex, 'func', funcName, checkIndexDict)
        console.log(funcName + ' ' + flowindex + ' ' + checkFlag)
        if (flowindex === 0) {
        }

            // else if (flowindex === main.length - 1 && allUselessArr > 0 && isLastFunc) {
            //     let judge = randomifJudge(undefined, checkName)
            //     bakflow.ifJudge = judge;
            //     let allNode = poisonArr.concat(uselessArr)
            //     addAllFlow(bakflow, allNode)
        // }
        else if (r > 0.7 && checkArr.length > 0 || checkFlag) {
            let checkBabelNode = undefined
            let trueRoad = undefined
            if (checkFlag) {
                let checkNode = checkIndexDict[flowindex]
                checkBabelNode = checkNode.blockNode
                trueRoad = checkNode.trueRoad
                if (!trueRoad || trueRoad === '-1') {
                } else if (trueRoad === '1') {
                    trueRoad = 'left'
                } else if (trueRoad === '0') {
                    trueRoad = 'right'
                }
            } else {
                checkBabelNode = checkArr.pop()
            }
            initCheckFlow(checkBabelNode, inlinefunarr, checkName, bakflow, trueRoad, funcName)
            // if (types.isBlockStatement(checkBabelNode)) {
            //     let _arr = checkBabelNode.body
            //     let ifbabel = undefined
            //     for (_item of _arr) {
            //         if (types.isFunctionDeclaration(_item)) {
            //             funarr.push(_item)
            //         } else if (types.isIfStatement(_item)) {
            //             ifbabel = _item
            //         }
            //     }
            //     if (ifbabel) {
            //         let trueFirst = randomBol(0.7)
            //         if (trueFirst) {
            //             bakflow.trueRoad = 'right'
            //         }
            //         let rbabelNode = ifbabel.test
            //         let judge = randomifJudge(rbabelNode, checkName)
            //         bakflow.ifJudge = judge;
            //         addAllFlow(bakflow, ifbabel.consequent.body)
            //     }
            // }
        } else if (r > 0.6 && allUselessArr.length > 0) {
            let judge = randomifJudge(undefined, checkName)
            bakflow.ifJudge = judge;
            if (allUselessArr.length > 0) {
                uselessindex++
                babelNode = allUselessArr.pop()
                if (types.isBlockStatement(babelNode)) {
                    let allNode = babelNode.body
                    addAllFlow(bakflow, allNode)
                } else {
                    let flow = new Flow(new FlowNode(babelNode))
                    bakflow.right = flow
                }
            }
        }

        flowindex++
        bakflow.funcName = funcName
        leftFlow.funcName = funcName
        bakflow = leftFlow
    }
    // let nodecount = stepCount(flowMain, 0) + 1
    // var indexArr = Random.ints(0, nodecount - 1)
    // addindexs(flowMain, indexArr, checkName, indexName)
    return [flowMain, bakflow]
}

function initFlow(main,  uselessArr, checkArr, checkName, indexName, funarr) {
    let flowMain = new Flow();
    let babelNode = undefined
    // let all = main.concat(poisonArr).concat(uselessArr)
    //带坐标的蜜罐
    var [checkIndexDict, checkArr] = parseCheckNode(checkArr)

    let flowiter = main[Symbol.iterator]()
    let flowindex = 1
    // let poisonindex = 0
    let uselessindex = 0
    flowMain.node = new FlowNode(flowiter.next().value)
    let bakflow = flowMain
    while (1) {
        if (flowindex === main.length) {
            bakflow.left = new Flow(new FlowNode(types.breakStatement()))
            break
        }
        if (flowindex === main.length - 1) {
            var r = (5 + Math.random() * 5) / 10;
        } else {
            var r = Math.random();
        }
        babelNode = flowiter.next().value
        let leftFlow = new Flow(new FlowNode(babelNode))
        bakflow.left = leftFlow
        let checkFlag = getCheckFlag(flowindex, 'Program', undefined, checkIndexDict)
        console.log(checkFlag)
        if (flowindex === 0) {
        } else if (flowindex === main.length - 1 &&  uselessArr.length > 0) {
            let judge = randomifJudge(undefined, checkName)
            bakflow.ifJudge = judge;
            addAllFlow(bakflow, uselessArr)
        } else if ((r > 0.7 && checkArr.length > 0) || checkFlag) {

            let checkBabelNode = undefined
            let trueRoad = undefined
            if (checkFlag) {
                let checkNode = checkIndexDict[flowindex]
                checkBabelNode = checkNode.blockNode
                trueRoad = checkNode.trueRoad
                if (!trueRoad || trueRoad === '-1') {
                } else if (trueRoad === '1') {
                    trueRoad = 'left'
                } else if (trueRoad === '0') {
                    trueRoad = 'right'
                }
            } else {
                checkBabelNode = checkArr.pop()
            }

            initCheckFlow(checkBabelNode, funarr, checkName, bakflow, trueRoad, 'Program')


            // let checkBabelNode = checkArr.pop()
            // if (types.isBlockStatement(checkBabelNode)) {
            //     let _arr = checkBabelNode.body
            //     let ifbabel = undefined
            //     for (_item of _arr) {
            //         if (types.isFunctionDeclaration(_item)) {
            //             funarr.push(_item)
            //         } else if (types.isIfStatement(_item)) {
            //             ifbabel = _item
            //         }
            //     }
            //     if (ifbabel) {
            //         let trueFirst = randomBol(0.7)
            //         if (trueFirst) {
            //             bakflow.trueRoad = 'right'
            //         }
            //         let rbabelNode = ifbabel.test
            //         let judge = randomifJudge(rbabelNode, checkName)
            //         bakflow.ifJudge = judge;
            //         addAllFlow(bakflow, ifbabel.consequent.body)
            //     }
            // }
        } else if (r > 0.6 && uselessArr.length > 0 ) {
            let judge = randomifJudge(undefined, checkName)
            bakflow.ifJudge = judge;
            uselessindex++
            babelNode = uselessArr.pop()
            if (types.isBlockStatement(babelNode)) {
                let allNode = babelNode.body
                addAllFlow(bakflow, allNode)
            } else {
                let flow = new Flow(new FlowNode(babelNode))
                bakflow.right = flow
            }

            //
            //
            // let judge = randomifJudge(undefined, checkName)
            //
            // // let bol = false
            // // let babelnode = types.expressionStatement(types.assignmentExpression('=', types.identifier(checkName), types.booleanLiteral(bol)))
            // // let judge = new ifJudge(new FlowNode(babelnode), bol);
            //
            //
            // bakflow.ifJudge = judge;
            // let _r = Math.random()
            // if ((poisonArr.length === 0 || _r > 0.5) && uselessArr.length > 0) {
            //     uselessindex++
            //     babelNode = uselessArr.pop()
            //     if (types.isBlockStatement(babelNode)) {
            //         let allNode = babelNode.body
            //         addAllFlow(bakflow, allNode)
            //     } else {
            //         let flow = new Flow(new FlowNode(babelNode))
            //         bakflow.right = flow
            //     }
            // } else {
            //     poisonindex++
            //     // itemNode = poisoniter.next().value
            //     babelNode = poisonArr.pop()
            //     if (types.isBlockStatement(babelNode)) {
            //         let allNode = babelNode.body
            //         addAllFlow(bakflow, allNode)
            //     } else {
            //         let flow = new Flow(new FlowNode(babelNode))
            //         bakflow.right = flow
            //     }
            //     // let flow = new Flow(new FlowNode(babelNode))
            //     // bakflow.right = flow
            // }
        }

        flowindex++
        bakflow = leftFlow
    }

    let nodecount = stepCount(flowMain, 0) + 1
    var indexArr = Random.ints(0, nodecount - 1)
    addindexs(flowMain, indexArr, checkName, indexName)
    return flowMain
}


function addAllFlow(flow, arr, funcName) {

    for (babelNode of arr) {
        if (types.isBlockStatement(babelNode)) {
            let allNode = babelNode.body
            flow = addAllFlow(flow, allNode)
        } else {
            _flow = new Flow(new FlowNode(babelNode))
            if (funcName !== undefined) {
                _flow.funcName = funcName
            }
            flow.right = _flow
            flow = _flow
        }
    }
    return flow
}

function stepCount(node, count, flowFuncName) {
    if (flowFuncName === undefined || flowFuncName === 'Program') {
        // flowFuncName='Program'
        flowFuncFlag = true
    } else {
        flowFuncFlag = flowFuncName === node.funcName
    }
    if ((node.left === undefined && node.right === undefined) || !flowFuncFlag) {
        return count
    }
    if (node.ifJudge !== undefined) {
        count += 2;
    }
    if (node.left !== undefined) {
        count = stepCount(node.left, count + 1, flowFuncName)
    }
    if (node.right !== undefined) {
        count = stepCount(node.right, count + 1, flowFuncName)
    }
    return count
}

function randomBol(seed) {
    if (!seed) {
        seed = 0.5
    }
    return Math.random() > seed
}


function randomifJudge(rightBabel, checkName) {
    bol = randomBol()
    if (!rightBabel) {
        rightBabel = types.booleanLiteral(bol)
    } else if (bol) {
        rightBabel = types.unaryExpression('!', rightBabel)
    }
    babelnode = types.expressionStatement(types.assignmentExpression('=', types.identifier(checkName), rightBabel))
    let judge = new ifJudge(new FlowNode(babelnode), bol);
    return judge
}


function chooseIndex(node, indexArr) {
    node.index = Random.choose(indexArr)
    remove(indexArr, node.index)
}


function flowifSta(flag, checkName, indexName, offset) {
    if (flag) {
        var test = types.identifier(checkName)
    } else {
        var test = types.unaryExpression('!', types.identifier(checkName))
    }

    return types.ifStatement(test = test, consequent = types.expressionStatement(types.assignmentExpression('+=', types.identifier(indexName), types.numericLiteral(offset))))

}

function addindexs(flow, indexArr, checkName, indexName) {
    chooseIndex(flow.node, indexArr)
    if (flow.ifJudge !== undefined) {
        chooseIndex(flow.ifJudge.checkNode, indexArr)
        if (flow.trueRoad === 'left') {
            let count = stepCount(flow.right, 1, flow.funcName);
            let stepNode = flowifSta(flow.ifJudge.flag, checkName, indexName, count)
            flow.ifJudge.stepNode = new FlowNode(stepNode)
            chooseIndex(flow.ifJudge.stepNode, indexArr)
        } else {
            let count = stepCount(flow.left, 1, flow.funcName);
            let stepNode = flowifSta(!flow.ifJudge.flag, checkName, indexName, count)
            flow.ifJudge.stepNode = new FlowNode(stepNode)
            chooseIndex(flow.ifJudge.stepNode, indexArr)
        }
    }
    if (flow.left === undefined && flow.right === undefined) {
        return
    }
    if (flow.left !== undefined) {
        addindexs(flow.left, indexArr, checkName, indexName)
    }
    if (flow.right !== undefined) {
        addindexs(flow.right, indexArr, checkName, indexName)
    }
}


function parseFlow2Switch(testIden, nodeDict) {
    let indexarr = Object.keys(nodeDict)
    let caseArr = []
    for (let o of indexarr) {
        let item = nodeDict[o]
        let conArr = [item]
        if (types.isBreakStatement(item)) {
            conArr.pop()
            conArr.push(types.returnStatement())
        } else if (!types.isReturnStatement(item)) {
            conArr.push(types.breakStatement())
        }
        let caseone = types.switchCase(types.numericLiteral(parseInt(o)), conArr)
        caseArr.push(caseone)
    }
    let switchsta = types.switchStatement(testIden, caseArr)
    return switchsta
}


function parseFlow2IF(flow, testnodeName, nodeDict) {
    testnode = binaryExpression(testnodeName, 0)
    let firstif = types.ifStatement(test = testnode, consequent = types.blockStatement(body = [nodeDict[0]]))
    ifStatement(nodeDict, testnodeName, firstif, 1, Object.keys(nodeDict).length)
    return firstif
}

function binaryExpression(testname, i) {
    return types.binaryExpression(operator = '<', left = types.identifier(testname), right = types.numericLiteral(i + 1))
}

function ifStatement(itemDict, testnodename, lastif, nowindex, length) {
    let testnode = binaryExpression(testnodename, nowindex)
    if (nowindex === length - 2) {
        lastif.alternate = types.ifStatement(test = testnode, consequent = types.blockStatement(body = [itemDict[nowindex]]), alternate = types.blockStatement(body = [itemDict[nowindex + 1]]))
        return lastif
    }
    let ifsta = types.ifStatement(test = testnode, consequent = types.blockStatement(body = [itemDict[nowindex]]), alternate = lastif)
    lastif.alternate = ifsta
    return ifStatement(itemDict, testnodename, ifsta, nowindex + 1, length)
}

function addPath(babelNode, index, arr, dict) {
    arr.push(index);
    dict[index] = babelNode;
}


function getPathArr(flow, arr, dict, thisFunc, nextFuncstartNode) {
    // flag = false
    addPath(flow.node.node, flow.node.index, arr, dict)
    // arr.push(flow.node.index);
    // dict[flow.node.index] = flow.node;
    if (flow.ifJudge !== undefined) {
        let flowNode = flow.ifJudge.checkNode
        addPath(flowNode.node, flowNode.index, arr, dict)
        flowNode = flow.ifJudge.stepNode
        addPath(flowNode.node, flowNode.index, arr, dict)
    }
    if (flow.right === undefined && flow.left === undefined) {
        return nextFuncstartNode;
    }
    if (flow.trueRoad === 'left') {
        if (flow.right !== undefined) {
            nextFuncstartNode = getPathArr(flow.right, arr, dict, thisFunc, nextFuncstartNode);
        }
        if (flow.left !== undefined) {
            if (flow.left.funcName === thisFunc) {
                nextFuncstartNode = getPathArr(flow.left, arr, dict, thisFunc, nextFuncstartNode);
            } else {
                nextFuncstartNode = flow.left
                flag = true
            }
        }
    } else {
        if (flow.left !== undefined) {
            nextFuncstartNode = getPathArr(flow.left, arr, dict, thisFunc, nextFuncstartNode);
        }
        if (flow.right !== undefined) {
            nextFuncstartNode = getPathArr(flow.right, arr, dict, thisFunc, nextFuncstartNode);
        }
    }
    return nextFuncstartNode

}


function doif(itemArr, testnodename) {
    itemdict = sortitem(itemArr)
    testnode = binaryExpression(testnodename, 0)
    let firstif = types.ifStatement(test = testnode, consequent = types.blockStatement(body = [itemdict[0]]))
    ifStatement(itemdict, testnodename, firstif, 1, itemArr.length)
    return firstif
}

function binaryExpression(testname, i) {
    return types.binaryExpression(operator = '<', left = types.identifier(testname), right = types.numericLiteral(i + 1))
}

function ifStatement(itemDict, testnodename, lastif, nowindex, length) {
    let testnode = binaryExpression(testnodename, nowindex)
    // console.log(itemdict[nowindex].declarations[0].init.value)
    if (nowindex === length - 2) {
        lastif.alternate = types.ifStatement(test = testnode, consequent = types.blockStatement(body = [itemDict[nowindex]]), alternate = types.blockStatement(body = [itemDict[nowindex + 1]]))
        return lastif
    }
    let ifsta = types.ifStatement(test = testnode, consequent = types.blockStatement(body = [itemDict[nowindex]]), alternate = lastif)
    lastif.alternate = ifsta
    return ifStatement(itemDict, testnodename, ifsta, nowindex + 1, length)
}


function sortitem(itemArr) {
    itemdict = {}
    for (item of itemArr) {
        itemdict[item['index']] = item['node']
    }
    return itemdict
}

function getpath(itemArr) {
    let patharr = new Array()
    for (item of itemArr) {
        patharr.push(item['index'])
    }
    return patharr


}

function getrandomindex(arr, length) {
    var arrbak = Random.ints(0, length - 1)
    for (item of arr) {
        remove(arrbak, item['index'])
    }
    return Random.choose(arrbak)
}


function remove(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr

}

function FlowNode(babelNode) {
    this.node = babelNode
    this.index = undefined
}

function ifJudge(checkNode, flag) {
    this.checkNode = checkNode;
    this.flag = flag;
    this.stepNode = undefined;
}


function generateFlow(ifsta,) {

}


function parmsNode(params, key) {
    if (params[key]) {
        return parser.parse(params[key])
    }
    return undefined
}

function filterFunc(body, funArr) {
    let retbody = []
    for (let o of body) {
        if (types.isFunctionDeclaration(o)) {
            funArr.push(o)
        } else {
            retbody.push(o)
        }
    }
    return retbody
}

exports.traverse_ProgramControlFlow = traverse_ProgramControlFlow
