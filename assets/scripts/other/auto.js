cc.Class({
    extends: cc.Component,

    properties: {
        gameNode: cc.Node,
    },
    /* 
        index 与上面两个Arr相关 blue1-8/red11-18  空地0
        type  所属颜色    蓝色0，红色1
        sign  矩阵顺序0-15
    */
    onLoad() {
        this.gameJs = this.gameNode.getComponent("game");;
        this.game;
        this.initList();
        this.redNum = -1;
        this.blueNum = -1;
        this.oldChess;
        this.Eat = [];
        this.eat = false;
        this.kong = 0;
    },
    initList() {
        this.openList = []        //已打开的chess
        this.openBlue = []
        this.openRed = []
        this.waitOpenList = []    //未打开的chess
        this.zero = [];           //this.game中为0的sign值
        this.blue = [];           //game中的序列
        this.red = [];
    },
    setList() {           //把node放进去。。。
        this.initList();
        this.game = this.gameJs.game;
        var gameNode = cc.find("Canvas/GameVer/game/chess").children;
        for (var i = 0; i < 16; i++) {
            var x = Math.floor(i / 4);
            var y = Math.floor(i % 4);
            if (this.game[x][y] < 10 && this.game[x][y] !== 0) {
                this.blue.push(i);
            }
            else if (this.game[x][y] >= 10 && this.game[x][y] !== 0) {
                this.red.push(i);
            }
            if (gameNode[i].getComponent("chess").getOpen()) {
                if (gameNode[i].getComponent("chess").sign == 100) {
                    continue;
                }
                if (gameNode[i].getComponent("chess").type == 0) {
                    this.openBlue.push(gameNode[i])
                }
                else if (gameNode[i].getComponent("chess").type == 1) {
                    this.openRed.push(gameNode[i])
                }
                this.openList.push(gameNode[i]);
            }
            else {
                this.waitOpenList.push(gameNode[i]);
            }
        }
        if (this.waitOpenList.length == 0) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (this.game[i][j] == 0) {
                        this.zero.push(i * 4 + j);
                    }
                }
            }
        }
    },

    //机器人为红色
    checkChessToOpen(openBlueChess, other) {   //判断两个chess是否颜色不同、打开状态、index是否为极限状态
        if (openBlueChess.type !== other.type && other.open == false) {
            if (openBlueChess.index == 1 && other.index == 18) {
                return false;
            }
            else if ((openBlueChess.index == 8 && other.index == 11)
                || openBlueChess.index % 10 < other.index % 10
                || openBlueChess.index % 10 !== other.index % 10) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    listToOpen(openChessJs) {
        var i = Math.floor(openChessJs.sign / 4);
        var j = Math.floor(openChessJs.sign % 4);  //红色 11-18
        var list = [];
        if (i - 1 >= 0) {
            if (this.game[i - 1][j] != 0) {
                if (this.checkChessToOpen(openChessJs, this.gameJs.getChessBySign((i - 1) * 4 + j).getComponent("chess"))) {
                    list.push([i - 1, j, this.game[i - 1][j]])
                }
            }
        }
        if (i + 1 < 4) {
            if (this.game[i + 1][j] != 0) {
                if (this.checkChessToOpen(openChessJs, this.gameJs.getChessBySign((i + 1) * 4 + j).getComponent("chess"))) {
                    list.push([i + 1, j, this.game[i + 1][j]])
                }
            }
        }
        if (j - 1 >= 0) {
            if (this.game[i][j - 1] != 0) {
                if (this.checkChessToOpen(openChessJs, this.gameJs.getChessBySign(i * 4 + (j - 1)).getComponent("chess"))) {
                    list.push([i, j - 1, this.game[i][j - 1]])
                }
            }
        }
        if (j + 1 < 4) {
            if (this.game[i][j + 1] != 0) {
                if (this.checkChessToOpen(openChessJs, this.gameJs.getChessBySign(i * 4 + (j + 1)).getComponent("chess"))) {
                    list.push([i, j + 1, this.game[i][j + 1]])
                }
            }
        }
        return list;
    },
    openChessBlue() {
        console.log(this.game)
        //如果不能吃，则执行以下代码
        if (this.openBlue.length > 0) {   //机器人是蓝色 1-8之间
            var openNo = Math.floor(this.openBlue.length * Math.random())
            var openChessJs = this.openBlue[openNo].getComponent("chess");
            var list = this.listToOpen(openChessJs);
            if (list.length == 0) {
                this.moveOrOpen();
            }
            for (var i = 0; i < list.length; i++) {      //检索当前蓝色棋子附近存在的可以吃它的棋子并翻开
                console.log(list[i])
                if ((openChessJs.index == 8 && list[i][2] == 11)
                    || list[i][2] % 10 > openChessJs.index % 10) {
                    this.gameJs.otherOpenChess(list[i][0] * 4 + list[i][1]);
                    break;
                }
                else {
                    if (list.length - 1 == i) {
                        this.moveOrOpen();
                    }
                }
            }
        }
        else {        //没有蓝色棋子   只有红色 与机器人同色
            this.moveOrOpen();
        }
    },
    moveOrOpen() {
        var dataAll = this.checkTBLR();
        if (this.waitOpenList.length > 0) {
            console.log("随机")
            var num = Math.floor(this.waitOpenList.length * Math.random());
            var sign = this.waitOpenList[num].getComponent("chess").sign;    //当前等待开启的棋子sign 1-8 11-18 
            this.gameJs.otherOpenChess(sign);
        }
        else {
            console.log("eat//moveToKong");
            this.moveKong(dataAll);
        }
    },
    eatChessBlue() {
        /*this.Eat 0: 11
        1: 15
        2: 14
        3: 15
        */
        var dataAll = this.checkTBLR()
        if (this.Eat.length > 0) {        //自己老鼠对方大象，对方老鼠自己任意
            if (this.Eat.length > 2) {     //老鼠，自己，自己
                var mouseSign=this.Eat[0];
                for(var i=0;i<this.Eat.length;i++){
                    var otherIndex=this.gameJs.getChessBySign(this.Eat[i]).getComponent("chess").index;
                    if(otherIndex%10!==1){   //当有两个以上的棋子可以吃老鼠时，当前棋子的%不等于老鼠
                        this.gameJs.otherPlayerEat("oldNew", this.Eat[i], mouseSign)
                        this.Eat = [];
                        return;
                    }
                }
                // var eatSign = this.Eat[1] > this.Eat[2] ? this.Eat[1] : this.Eat[2];
                // this.gameJs.otherPlayerEat("oldNew", eatSign, mouseSign)
            }
            else {
                // var mouseIndex=this.gameJs.getChessBySign(this.Eat[0]).getComponent("chess").index;
                var otherIndex=this.gameJs.getChessBySign(this.Eat[1]).getComponent("chess").index;
                var eatType = otherIndex % 10 !== 1 ? "oldNew" : "equal";
                this.gameJs.otherPlayerEat(eatType, this.Eat[1], this.Eat[0]);
                this.Eat = [];
                return;
            }
            
        }
        else if (this.eat) {
            for (var i = 0; i < dataAll.length; i++) {
                if (dataAll[i].t == "eat") {
                    this.eat = false;
                    this.gameJs.otherPlayerEat("oldNew", dataAll[i].sign, dataAll[i].sign - 4)
                    return;
                }
                else if (dataAll[i].b == "eat") {
                    this.eat = false;
                    this.gameJs.otherPlayerEat("oldNew", dataAll[i].sign, dataAll[i].sign + 4)
                    return;
                }
                else if (dataAll[i].l == "eat") {
                    this.eat = false;
                    this.gameJs.otherPlayerEat("oldNew", dataAll[i].sign, dataAll[i].sign - 1)
                    return;
                }
                else if (dataAll[i].r == "eat") {
                    this.eat = false;
                    this.gameJs.otherPlayerEat("oldNew", dataAll[i].sign, dataAll[i].sign + 1)
                    return;
                }
            }
        }
        this.openChessBlue();
    },
    checkTBLR() {
        this.Eat = [];
        this.kong = 0;
        this.eat = false;
        var dataAll = [];
        for (var i = 0; i < this.openRed.length; i++) {
            var chessJs = this.openRed[i].getComponent("chess");           //当前检索红色棋子脚本
            var x = Math.floor(chessJs.sign / 4);
            var y = chessJs.sign % 4;
            var data = { sign: 0, l: "false", r: "false", t: "false", b: "false" }  //4个存当前四个棋子的方向所在是否可移动   存入true 
            data.sign = chessJs.sign;
            if (x - 1 >= 0) {      //上
                if (this.game[x - 1][y] == 0) {
                    data.t = "kong";
                    this.kong++;
                }
                else if (this.gameJs.getChessBySign((x - 1) * 4 + y).getComponent("chess").open == false) {
                    data.t = "false";   //未打开 不需要判断
                }
                else if (this.gameJs.getChessBySign((x - 1) * 4 + y).getComponent("chess").open) {
                    if ((this.game[x][y] == 11 && this.game[x - 1][y] == 8)
                        || (this.game[x - 1][y] == 1 && this.game[x][y] !== 18)) {   //红色老鼠 蓝色大象 最优先
                        data.t = "Eat";
                        this.Eat.push(chessJs.sign - 4);
                        this.Eat.push(chessJs.sign);
                    }
                    if (this.game[x][y] == 18 && this.game[x - 1][y] == 1) {  //自己大象 对面老鼠 跑
                        data.t = "Run";
                    }
                    else if (this.game[x][y] % 10 > this.game[x - 1][y] % 10
                        && Math.floor(this.game[x][y] / 10) != Math.floor(this.game[x - 1][y] / 10)) {
                        data.t = "eat";
                        this.eat = true;
                    }
                    else {
                        data.t = "run";
                    }
                }
                /*如果对方大于自己并且棋子被打开run   自己大象他人老鼠Run
                  如果为run 判断其他三个是否存在kong、eat 并且该方向的上下均不会吃自己
                */
            }
            else {
                data.t = "none";
            }
            if (x + 1 < 4) {      //下
                if (this.game[x + 1][y] == 0) {
                    data.b = "kong"
                    this.kong++;
                }
                else if (this.gameJs.getChessBySign((x + 1) * 4 + y).getComponent("chess").open == false) {
                    data.b = "false";
                }
                else if (this.gameJs.getChessBySign((x + 1) * 4 + y).getComponent("chess").open) { //可以   不可以吃
                    if ((this.game[x][y] == 11 && this.game[x + 1][y] == 8)
                        || (this.game[x + 1][y] == 1 && this.game[x][y] !== 18)) {   //红色老鼠 蓝色大象 或 红色老鼠和其他 最优先
                        data.b = "Eat";
                        this.Eat.push(chessJs.sign + 4);
                        this.Eat.push(chessJs.sign);
                    }
                    if (this.game[x][y] == 18 && this.game[x + 1][y] == 1) {
                        data.b = "Run";
                    }
                    else if (this.game[x][y] % 10 > this.game[x + 1][y] % 10
                        && Math.floor(this.game[x][y] / 10) != Math.floor(this.game[x + 1][y] / 10)) {
                        data.b = "eat";
                        this.eat = true;
                    }
                    else if (this.game[x][y] % 10 == this.game[x + 1][y] % 10) {
                        data.b = "equal";
                    }
                    else {
                        data.b = "run";
                    }
                }
            }
            else {
                data.b = "none";
            }
            if (y - 1 >= 0) {     //左
                if (this.game[x][y - 1] == 0) {
                    data.l = "kong"
                    this.kong++;
                }
                else if (this.gameJs.getChessBySign(x * 4 + (y - 1)).getComponent("chess").open == false) {
                    data.l = "false";
                }
                else if (this.gameJs.getChessBySign(x * 4 + (y - 1)).getComponent("chess").open) {
                    if ((this.game[x][y] == 11 && this.game[x][y - 1] == 8)
                        || (this.game[x][y] !== 18 && this.game[x][y - 1] == 1)) {
                        data.l = "Eat";
                        this.Eat.push(chessJs.sign - 1);
                        this.Eat.push(chessJs.sign);
                    }
                    if (this.game[x][y] == 18 && this.game[x][y - 1] == 1) {
                        data.l = "Run";
                    }
                    else if (this.game[x][y] % 10 > this.game[x][y - 1] % 10
                        && Math.floor(this.game[x][y] / 10) != Math.floor(this.game[x][y - 1] / 10)) {
                        data.l = "eat";
                        this.eat = true;
                    }
                    else if (this.game[x][y] % 10 == this.game[x][y - 1] % 10) {
                        data.l = "equal";
                    }
                    else {
                        data.l = "run";
                    }
                }
            }
            else {
                data.l = "none";
            }
            if (y + 1 < 4) {      //右
                if (this.game[x][y + 1] == 0) {
                    data.r = "kong"
                    this.kong++;
                }
                else if (this.gameJs.getChessBySign(x * 4 + (y + 1)).getComponent("chess").open == false) {
                    data.r = "false";
                }
                else if (this.gameJs.getChessBySign(x * 4 + (y + 1)).getComponent("chess").open) {
                    if ((this.game[x][y] == 11 && this.game[x][y + 1] == 8)
                        || (this.game[x][y + 1] == 1 && this.game[x][y] !== 18)) {
                        data.r = "Eat";
                        this.Eat.push(chessJs.sign + 1);
                        this.Eat.push(chessJs.sign);
                    }
                    if (this.game[x][y] == 18 && this.game[x][y + 1] == 1) {
                        data.r = "Run";
                    }
                    else if (this.game[x][y] % 10 > this.game[x][y + 1] % 10
                        && Math.floor(this.game[x][y] / 10) != Math.floor(this.game[x][y + 1] / 10)) {
                        data.r = "eat";
                        this.eat = true;
                    }
                    else if (this.game[x][y] % 10 == this.game[x][y + 1] % 10) {
                        data.r = "equal";
                    }
                    else {
                        data.r = "run";
                    }
                }
            }
            else {
                data.r = "none";
            }
            dataAll.push(data);
        }
        console.log(dataAll);
        return dataAll;
    },
    checkKongNum(dataAll) {
        this.kong = 0;
        for (var i = 0; i < dataAll.length; i++) {
            if (dataAll[i].l == "kong" || dataAll[i].r == "kong" || dataAll[i].t == "kong" || dataAll[i].b == "kong") {
                this.kong++;
            }
            else {
                dataAll.splice(i, 1);
            }
        }
    },
    moveKong(dataAll) {     //每一条 {sign: --, l: "--", r: "--", t: "--", b: "--"} 
        /*
            1.随机取一个数组中的一条
            2.除去false 优先 Eat > eat > kong
            3.               Eat >Run > eat > run > kong
        */
        this.checkKongNum(dataAll);
        console.log("*********************")
        console.log(this.kong);
        console.log(dataAll)
        console.log("*********************")

        if (this.kong > 0) {
            var random = Math.floor(Math.random() * dataAll.length);
            var x = Math.floor(dataAll[random].sign / 4);
            var y = dataAll[random].sign % 4;
            console.log(dataAll[random])
            var l = false;
            var r = false;
            var t = false;
            var b = false;
            if (dataAll[random].t == "kong") {
                if (dataAll[random].l !== "none" && dataAll[random].r !== "none") { //左右均不为空
                    t = true;
                    if ((this.game[x][y] % 10 > this.game[x - 1][y - 1] % 10 && this.game[x][y] % 10 > this.game[x - 1][y + 1] % 10) &&
                        (this.game[x][y] !== 8 && this.game[x - 1][y - 1] !== 11 && this.game[x - 1][y + 1] !== 11)) {  //自己大于旁边两个   并且没有老鼠大象的情况
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign - 4)
                        return;
                    }
                }
                else if (dataAll[random].l !== "none") {    //左为空
                    t = true;
                    if ((this.game[x][y] % 10 > this.game[x - 1][y + 1] % 10)
                        && (this.game[x][y] !== 8 && this.game[x - 1][y + 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign - 4)
                        return;
                    }
                }
                else if (dataAll[random].r !== "none") {    //右为空
                    t = true;
                    if ((this.game[x][y] % 10 > this.game[x - 1][y - 1] % 10)
                        && (this.game[x][y] !== 8 && this.game[x - 1][y - 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign - 4)
                        return;
                    }
                }
            }
            if (dataAll[random].b == "kong") {
                b = true;
                if (dataAll[random].l !== "none" && dataAll[random].r !== "none") { //左右均不为空
                    if ((this.game[x][y] % 10 > this.game[x + 1][y - 1] % 10 && this.game[x][y] % 10 > this.game[x + 1][y + 1] % 10) &&
                        (this.game[x][y] !== 8 && this.game[x + 1][y - 1] !== 11 && this.game[x + 1][y + 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign + 4)
                        return;
                    }
                }
                else if (dataAll[random].l !== "none") {    //左为空
                    b = true;
                    if ((this.game[x][y] % 10 > this.game[x + 1][y + 1] % 10) &&
                        (this.game[x][y] !== 8 && this.game[x + 1][y + 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign + 4)
                        return;
                    }
                }
                else if (dataAll[random].r !== "none") {    //右为空
                    b = true;
                    if ((this.game[x][y] % 10 > this.game[x + 1][y - 1] % 10) &&
                        (this.game[x][y] !== 8 && this.game[x + 1][y - 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign + 4)
                        return;
                    }
                }
            }
            if (dataAll[random].l == "kong") {
                if (dataAll[random].t !== "none" && dataAll[random].b !== "none") { //上下均不为空
                    l = true;
                    if ((this.game[x][y] % 10 > this.game[x - 1][y - 1] % 10 && this.game[x][y] % 10 > this.game[x + 1][y - 1] % 10) &&
                        (this.game[x][y] !== 8 && this.game[x - 1][y - 1] !== 11 && this.game[x + 1][y - 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign - 1)
                        return;
                    }
                }
                else if (dataAll[random].t !== "none") {
                    l = true;
                    if ((this.game[x][y] % 10 > this.game[x - 1][y - 1] % 10)
                        && (this.game[x][y] !== 8 && this.game[x - 1][y - 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign - 1)
                        return;
                    }
                }
                else if (dataAll[random].b !== "none") {
                    l = true;
                    if ((this.game[x][y] % 10 > this.game[x + 1][y - 1] % 10) &&
                        (this.game[x][y] !== 8 && this.game[x + 1][y - 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign - 1)
                        return;
                    }
                }
            }
            if (dataAll[random].r == "kong") {
                if (dataAll[random].t !== "none" && dataAll[random].b !== "none") { //上下均不为空
                    r = true;
                    if ((this.game[x][y] % 10 > this.game[x - 1][y + 1] % 10 && this.game[x][y] % 10 > this.game[x + 1][y + 1] % 10) &&
                        (this.game[x][y] !== 8 && this.game[x - 1][y + 1] !== 11 && this.game[x + 1][y + 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign + 1)
                        return;
                    }
                }
                else if (dataAll[random].t !== "none") {    //上不为空
                    r = true;
                    if ((this.game[x][y] % 10 > this.game[x - 1][y + 1] % 10)
                        && (this.game[x][y] !== 8 && this.game[x - 1][y + 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign + 1)
                        return;
                    }
                }
                else if (dataAll[random].b !== "none") {
                    r = true;
                    if ((this.game[x][y] % 10 > this.game[x + 1][y + 1] % 10)
                        && (this.game[x][y] !== 8 && this.game[x + 1][y + 1] !== 11)) {
                        this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign + 1)
                        return;
                    }
                }
            }//1.遇到break最终没执行  2.数组中无数组 需要另外移动
            if (this.kong > 1) {
                dataAll.splice(random, 1);
                this.moveKong(dataAll)
            }
            else {
                console.log("kong为1  !!!!!!!!!!!!!!!!!!!!")
                if (l) {
                    this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign - 1)
                }
                else if (r) {
                    this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign + 1)
                }
                else if (t) {
                    this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign - 4)
                }
                else if (b) {
                    this.gameJs.otherMoveToKong(dataAll[random].sign, dataAll[random].sign + 4)
                }
            }
        }
        else {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            console.log("kon小于0")
            var dataAll = this.checkTBLR();
            for (var i = 0; i < dataAll.length; i++) {
                for (var j = 0; j < 2; j++) {
                    var actionName, action;
                    if (j == 0) {
                        actionName = "equal";
                        action = "newOld";
                    }
                    else if (j == 1) {
                        actionName = "equal";
                        action = "equal";
                    }
                    if (dataAll[i].t == actionName) {
                        this.gameJs.otherPlayerEat(action, dataAll[i].sign, dataAll[i].sign - 4)
                        return;
                    }
                    else if (dataAll[i].b == actionName) {
                        this.gameJs.otherPlayerEat(action, dataAll[i].sign, dataAll[i].sign + 4)
                        return;
                    }
                    else if (dataAll[i].l == actionName) {
                        this.gameJs.otherPlayerEat(action, dataAll[i].sign, dataAll[i].sign - 1)
                        return;
                    }
                    else if (dataAll[i].r == actionName) {
                        this.gameJs.otherPlayerEat(action, dataAll[i].sign, dataAll[i].sign + 1)
                        return;
                    }
                }
            }
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        }
    },
});