const Random = {}
Random.randomNode = function (program, num) {
    if (!program) {
        return []
    }
    let body = program.program.body
    if (!num) {
        num = body.length
    }
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

Random.randomParamName = function (path, paramPool) {
    if (!body) {
        return []
    }
    if (!num) {
        num = body.length
    }
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

Random.ints = function (left, right) {
    var arr2 = new Array();
    for (var i = left; i < right + 1; i++) {
        arr2.push(i);
    }
    return arr2;
}
Random.choose = function (arr) {
    return arr[Math.floor((Math.random() * arr.length))];
}

Random.randomBol  = function (seed) {
    if (!seed) {
        seed = 0.5
    }
    return Math.random() > seed
}
Random.randomWord  = function (count) {
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

Random.randomParamName = function (path, paramPool) {
    while (1) {
        let name = '_$$' + Random.randomWord(2)
        let bd = path.scope.getBinding(name)
        if (bd === undefined && paramPool.indexOf(name) < 0) {
            paramPool.push(name)
            return name
        }
    }
}


exports.Random = Random

