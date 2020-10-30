{
    // ProgramOrFunc funcName row trueRoad一般配套使用
    //名称【木有用】
    this.name='document蜜罐';
    //出现主体混淆还是函数方法混淆【Program or Func ,为空则随机】
    this.ProgramOrFunc='Program';
    //出现在什么函数中【为空则随机，非函数】
    this.funcName = 'a';
    //出现在第几行之后【-1则为随机出现，默认-1。1开始，函数混淆控制流必须填funcName】
    this.row='1'
    //遇到检测是否跳步 【-1：随机，1：是，0：否】
    this.trueRoad='1'

    if (!document) {
        console.log('指定第1行检测流程1')
    }
}

{
    this.name='document蜜罐2';
    this.ProgramOrFunc='';
    this.funcName = '';
    this.row='-1'
    this.trueRoad='-1'
    if (!document) {
        console.log('检测失败流程1')
    }
}
