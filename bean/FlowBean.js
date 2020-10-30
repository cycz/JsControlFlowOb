


function checkNode() {
    this.name = undefined;
    this.ProgramOrFunc = '';
    this.funcName = '';
    this.row = '-1';
    this.trueRoad = '-1';
    this.blockNode = undefined;
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


function FlowNode(babelNode) {
    this.node = babelNode
    this.index = undefined
}

function ifJudge(checkNode, flag) {
    this.checkNode = checkNode;
    this.flag = flag;
    this.stepNode = undefined;
}

exports.checkNode = checkNode
exports.Flow = Flow
exports.funcflowNode = funcflowNode
exports.FlowNode = FlowNode
exports.ifJudge = ifJudge
