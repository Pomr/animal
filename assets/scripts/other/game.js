var pool = require("pool");
var GLB = require("Glb")
cc.Class({
    extends: cc.Component,

    properties: {
        chess: cc.Prefab,
        next: cc.Prefab,
    },
    onLoad() {
        this.GameVerJs = cc.find("Canvas/GameVer").getComponent("GameVer")
        pool.createPoolNode(this.chess, this.next);
        this.initArr();
        this.otherMapInit = false;
        console.log(GLB.isRoomOwner);
        if (GLB.isRoomOwner && this.otherMapInit == false) {
            this.setmap();   //地图数组
            Game.gameManager.sendEvent("start", this.gameToOther);
            this.otherMapInit = true;
            this.kongNum = 0;
        }
        this.initRound();
        this.scale = 1.15;
        this.over = false;
    },

    initRound() {
        if (GLB.isRoomOwner) {
            this.round = GLB.round.self;
        }
        else {
            this.round = GLB.round.other;
        }
    },
    changeRound() {
        this.gameOver();
        console.log("changeRound");
        console.log(Game.gameManager.gameState != GameState.play)
        if (Game.gameManager.gameState != GameState.play) return;
        this.GameVerJs.setTimeNum(30);
        if (this.round == GLB.round.self) {
            this.round = GLB.round.other;
            this.GameVerJs.changeTimeColor();
            this.GameVerJs.clearTime()
            this.GameVerJs.countTime();
            if (Game.gameManager.showAuto()) {
                console.log("over:" + this.over)
                this.autoAction();
            }
        }
        else if (this.round == GLB.round.other) {
            this.round = GLB.round.self;
            this.GameVerJs.changeTimeColor();
            this.GameVerJs.countTime();
        }
    },
    initGame(arr) {
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.column; j++) {
                this.game[i][j] = arr[i * this.row + j];
            }
        }
        this.setmapByOwner();
    },
    setmapByOwner() {   //通过获取owner的数组生成地图
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.column; j++) {
                var next = pool.getNext();
                this.node.getChildByName("next").addChild(next);
                next.setPosition(this.posArr[i][j]);
                var nextJs = next.getComponent(next.name);
                nextJs.setNextSign(i * this.row + j);    //i行j列
                this.nextArr.push(next);
                var chess = pool.getChess();
                this.node.getChildByName("chess").addChild(chess);
                chess.setPosition(this.posArr[i][j]);
                var chessJs = chess.getComponent(chess.name);
                chessJs.setChessSign(i * this.row + j);
                this.chessArr.push(chess);
                // var chessMsg = { pos: this.posArr[i][j], sign: chess.getComponent("chess").sign };
                // chessMsg.type = Math.floor(this.game[i][j] / 10);
                // chessMsg.index = this.game[i][j];
                chessJs.setChess(Math.floor(this.game[i][j] / 10), this.game[i][j]);
                // this.showChessMsg.push(chessMsg);
            }
        }
        Game.gameManager.sendEvent("readygo");
    },
    initArr() {
        this.row = 4;
        this.column = 4;
        this.gamedWidth = this.node.width;
        this.gameHeight = this.node.height;
        this.longX = this.gamedWidth / this.column;
        this.longY = this.gameHeight / this.row;
        // this.showChessMsg = [];
        this.chessArr = [];    //存棋子 16*chess
        this.nextArr = [];     //存next
        this.game = [       //存sign值 1-8/11-18
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]
        this.gameToOther = [];
        this.posArr = [];
        for (var x = 0; x < this.row; x++) {     //4*4 16个数据[[每一个cc.v2(x,y)],[],[],[]]
            var areaLine = [];
            for (var y = 0; y < this.column; y++) {
                var pos = cc.v2(-this.gamedWidth / 2 + y * this.longX + this.longX / 2, this.gameHeight / 2 - x * this.longY - this.longY / 2 + 5);
                areaLine[y] = pos;
            }
            this.posArr.push(areaLine);
        }
    },
    initOldChessNode() {
        this.oldChessNode = null;
    },
    setmap() {        //初始化chess的animal和next
        var blueArr = [1, 2, 3, 4, 5, 6, 7, 8];
        var redArr = [11, 12, 13, 14, 15, 16, 17, 18];
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.column; j++) {
                var next = pool.getNext();
                this.node.getChildByName("next").addChild(next);
                next.setPosition(this.posArr[i][j]);
                var nextJs = next.getComponent(next.name);
                nextJs.setNextSign(i * this.row + j);    //i行j列
                this.nextArr.push(next);
                var chess = pool.getChess();
                this.node.getChildByName("chess").addChild(chess);
                chess.setPosition(this.posArr[i][j]);
                var chessJs = chess.getComponent(chess.name);
                chessJs.setChessSign(i * this.row + j);
                this.chessArr.push(chess);
                // var chessMsg = { pos: this.posArr[i][j], sign: chess.getComponent("chess").sign };
                var random = Math.random();
                if (random >= 0.5) {
                    if (blueArr.length == 0) {
                        if (redArr.length == 0) {
                            break;
                        }
                        else {
                            this.chessInfo(redArr, chessJs, i, j, GLB.playerFlag.red);
                        }
                    }
                    else {
                        this.chessInfo(blueArr, chessJs, i, j, GLB.playerFlag.blue);
                    }
                }
                else {
                    if (redArr.length == 0) {
                        if (blueArr.length == 0) {
                            break;
                        }
                        this.chessInfo(blueArr, chessJs, i, j, GLB.playerFlag.blue);
                    }
                    else {
                        this.chessInfo(redArr, chessJs, i, j, GLB.playerFlag.red);
                    }
                }
            }
        }
        console.log(this.game)
    },
    chessInfo(arr, chessJs, i, j, type) {
        var index = Math.floor(Math.random() * arr.length);
        // chessMsg.type = GLB.playerFlag.red;
        // chessMsg.index = redArr[index];
        chessJs.setChess(type, arr[index]);
        this.game[i][j] = arr[index];
        this.gameToOther[i * this.row + j] = arr[index];
        arr.splice(index, 1);
    },
    checkselfColor(node) {   //type 0/1
        return node.getComponent("chess").type !== this.GameVerJs.showPlayerFlag();
    },
    chessMove(node) {
        if (this.oldChessNode == null) {
            if (this.checkselfColor(node)) return;  //true return
            this.checkOtherChess(node);
            this.oldChessNode = node;
            // node.setScale(1.15);
            node.getComponent(cc.Animation).play("chessToBig");
            node.getChildByName("check").active = true;
        }
        else if (this.oldChessNode === node) {
            node.getComponent(node.name).hideMove();
            this.initOldChessNode();
            // node.setScale(1);
            node.getComponent(cc.Animation).play("chessToSmall");
        }
        else {
            node.getChildByName("check").active = false;
            if (this.oldChessNode.getComponent("chess").type == node.getComponent("chess").type) {
                this.oldChessNode.getComponent("chess").hideMove();
                // this.oldChessNode.setScale(1);
                this.oldChessNode.getComponent(cc.Animation).play("chessToSmall");
                // node.setScale(1.15);
                node.getComponent(cc.Animation).play("chessToBig");
                this.oldChessNode = node;
                this.checkOtherChess(node);
            }
            else {
                this.oldChessNode.getComponent("chess").hideMove();
                this.eatOther(node);
            }
        }
    },
    chessMoveKong(node) {
        if (this.oldChessNode) {     //chess移动到该位置（上下左右1），sign改变，重置oldChessNode，
            this.oldChessNode.getChildByName("check").active = false;
            this.oldChessNode.getComponent("chess").hideMove();
            var kongSign = node.getComponent(node.name).sign;     //0-15
            var chessSign = this.oldChessNode.getComponent("chess").sign;
            var kongX = Math.floor(kongSign / this.row);     //X行 Y列
            var kongY = kongSign % this.column;
            var chessX = Math.floor(chessSign / this.row);
            var chessY = chessSign % this.column;
            var callback = cc.callFunc(function () {
                Game.gameManager.sendEvent("moveToKong", chessSign, kongSign);
                this.game[kongX][kongY] = this.oldChessNode.getComponent("chess").index;
                this.game[chessX][chessY] = 0;
                this.oldChessNode.getComponent("chess").sign = node.getComponent("next").sign;
                // this.oldChessNode.setScale(1);
                if (this.oldChessNode.scale == this.scale) {
                    this.oldChessNode.getComponent(cc.Animation).play("chessToSmall");
                }
                this.initOldChessNode();
                uiManager.music("pieceClick");
                if (GLB.isRoomOwner) {
                    this.kongNum++;
                    this.checkKongNum();
                }
            }.bind(this))
            if (kongY - chessY == 1 && kongX == chessX) {
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), callback))
                this.changeRound();
            }
            else if (kongY - chessY == -1 && kongX == chessX) {
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), callback))
                this.changeRound();
            }
            else if (kongX - chessX == 1 && kongY == chessY) {
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), callback))
                this.changeRound();
            }
            else if (kongX - chessX == -1 && kongY == chessY) {
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), callback))
                this.changeRound();
            }
            else {
                this.oldChessNode.getComponent("chess").hideMove();
                // this.oldChessNode.setScale(1);
                this.oldChessNode.getComponent(cc.Animation).play("chessToSmall");
            }
        }
    },
    checkOtherChess(node) {
        var data = { left: false, right: false, up: false, down: false };
        var sign = node.getComponent(node.name).sign;
        var x = Math.floor(sign / this.column);
        var y = sign % this.column;
        if (x - 1 >= 0) {
            var otherChessIndex = this.game[parseInt((sign - 4) / 4)][(sign - 4) % 4];
            var selfChessIndex = this.game[parseInt((sign) / 4)][(sign) % 4];
            data = this.ischeck(otherChessIndex, selfChessIndex, data, "up");
        }
        if (x + 1 <= this.row - 1) {
            var otherChessIndex = this.game[parseInt((sign + 4) / 4)][(sign + 4) % 4];
            var selfChessIndex = this.game[parseInt((sign) / 4)][(sign) % 4];
            data = this.ischeck(otherChessIndex, selfChessIndex, data, "down");
        }
        if (y - 1 >= 0) {
            var otherChessIndex = this.game[parseInt((sign - 1) / 4)][(sign - 1) % 4];
            var selfChessIndex = this.game[parseInt((sign) / 4)][(sign) % 4];
            data = this.ischeck(otherChessIndex, selfChessIndex, data, "left");
        }
        if (y + 1 <= this.column - 1) {
            var otherChessIndex = this.game[parseInt((sign + 1) / 4)][(sign + 1) % 4];
            var selfChessIndex = this.game[parseInt((sign) / 4)][(sign) % 4];
            data = this.ischeck(otherChessIndex, selfChessIndex, data, "right");
        }
        this.currentChessNode = this.getChessBySign(sign);
        this.currentChessNode.getComponent("chess").setMoveColor(data);
    },
    ischeck(otherChessIndex, selfChessIndex, data, parm) {  //相同、小于黄色，大于红色
        if ((parseInt(otherChessIndex / 10) !== parseInt(selfChessIndex / 10)) || (otherChessIndex === 0)) {
            if (otherChessIndex === 0) {     //当前其他节点为空 
                data[parm] = true;
                data["largeThan" + parm] = true;
                return data;
            }
            var sign = this.getSignByIndex(otherChessIndex);
            var chessNode = this.getChessBySign(sign);
            var chessJs = chessNode.getComponent(this.chess.name);
            if (!chessJs.getOpen()) {
                return data;
            }
            data[parm] = true;
            if (otherChessIndex % 10 > selfChessIndex % 10) {   //判断比当前chess大 largeThan。。为true
                data["largeThan" + parm] = false;
            } else {
                data["largeThan" + parm] = true;
            }
            if (otherChessIndex % 10 === 8 && selfChessIndex % 10 === 1) {
                data["largeThan" + parm] = true;
            } else if (selfChessIndex % 10 === 8 && otherChessIndex % 10 === 1) {
                data["largeThan" + parm] = false;
            }
        }
        return data;
    },
    eatOther(node) {
        var newSign = node.getComponent("chess").sign;     //0-15
        var oldSign = this.oldChessNode.getComponent("chess").sign;
        var newX = Math.floor(newSign / this.row);     //X行 Y列
        var newY = newSign % this.column;
        var oldX = Math.floor(oldSign / this.row);
        var oldY = oldSign % this.column;
        node.zindex = 0;
        this.oldChessNode.zIndex = node.zIndex + 1;    //于node之上显示
        var equal = cc.callFunc(function () {
            Game.gameManager.sendEvent("eat", oldSign, newSign, "equal");
            // this.oldChessNode.setScale(1);
            console.log("###########"+this.oldChessNode+"###########");
            if (this.oldChessNode !== null) {
                this.oldChessNode.getComponent(cc.Animation).play("chessToSmall");
                this.game[newX][newY] = 0;
                this.game[oldX][oldY] = 0;
                this.oldChessNode.active = false;
                node.active = false;
                this.gameOver();
                console.log("eatOther");
                this.initOldChessNode();
                uiManager.music("allDie");
                if (GLB.isRoomOwner) {
                    this.kongNum = 0;
                }
            }
        }.bind(this))
        var newOld = cc.callFunc(function () {
            Game.gameManager.sendEvent("eat", oldSign, newSign, "newOld");
            // this.oldChessNode.setScale(1);
            console.log("###########"+this.oldChessNode+"###########");
            if (this.oldChessNode !== null) {
                this.oldChessNode.getComponent(cc.Animation).play("chessToSmall");
                this.game[oldX][oldY] = 0;
                this.oldChessNode.active = false;
                this.gameOver();
                console.log("eatOther");
                this.initOldChessNode();
                uiManager.music("eat");
                if (GLB.isRoomOwner) {
                    this.kongNum = 0;
                }
            }
        }.bind(this))
        var oldNew = cc.callFunc(function () {
            Game.gameManager.sendEvent("eat", oldSign, newSign, "oldNew");
            // this.oldChessNode.setScale(1);
            console.log("###########"+this.oldChessNode+"###########");
            if (this.oldChessNode !== null) {
                this.oldChessNode.getComponent(cc.Animation).play("chessToSmall");
                this.game[oldX][oldY] = 0
                this.game[newX][newY] = this.oldChessNode.getComponent("chess").index;
                node.active = false;
                this.gameOver();
                console.log("eatOther");
                this.initOldChessNode();
                uiManager.music("eat");
                if (GLB.isRoomOwner) {
                    this.kongNum = 0;
                }
            }
        }.bind(this))
        if (newY - oldY == 1 && newX == oldX) {
            if (this.game[newX][newY] % 10 == this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = 100;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), equal))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 == 1 && this.game[oldX][oldY] % 10 == 8) {
                this.oldChessNode.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), newOld))
                this.changeRound();
            }
            else if ((this.game[newX][newY] % 10 == 8 && this.game[oldX][oldY] % 10 == 1)) {
                this.oldChessNode.getComponent("chess").sign = newSign;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), oldNew))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 > this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), newOld))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 < this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = newSign;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), oldNew))
                this.changeRound();
            }
        }
        else if (newY - oldY == -1 && newX == oldX) {
            if (this.game[newX][newY] % 10 == this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = 100;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), equal))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 == 1 && this.game[oldX][oldY] % 10 == 8) {
                this.oldChessNode.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), newOld))
                this.changeRound();
            }
            else if ((this.game[newX][newY] % 10 == 8 && this.game[oldX][oldY] % 10 == 1)) {
                this.oldChessNode.getComponent("chess").sign = newSign;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), oldNew))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 > this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), newOld))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 < this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = newSign;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), oldNew))
                this.changeRound();
            }
        }
        else if (newX - oldX == 1 && newY == oldY) {
            if (this.game[newX][newY] % 10 == this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = 100;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), equal))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 == 1 && this.game[oldX][oldY] % 10 == 8) {
                this.oldChessNode.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), newOld))
                this.changeRound();
            }
            else if ((this.game[newX][newY] % 10 == 8 && this.game[oldX][oldY] % 10 == 1)) {
                this.oldChessNode.getComponent("chess").sign = newSign;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), oldNew))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 > this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), newOld))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 < this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = newSign;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), oldNew))
                this.changeRound();
            }
        }
        else if (newX - oldX == -1 && newY == oldY) {
            if (this.game[newX][newY] % 10 == this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = 100;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), equal))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 == 1 && this.game[oldX][oldY] % 10 == 8) {
                this.oldChessNode.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), newOld))
                this.changeRound();
            }
            else if ((this.game[newX][newY] % 10 == 8 && this.game[oldX][oldY] % 10 == 1)) {
                this.oldChessNode.getComponent("chess").sign = newSign;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), oldNew))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 > this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), newOld))
                this.changeRound();
            }
            else if (this.game[newX][newY] % 10 < this.game[oldX][oldY] % 10) {
                this.oldChessNode.getComponent("chess").sign = newSign;
                node.getComponent("chess").sign = 100;
                this.oldChessNode.runAction(cc.sequence(cc.moveTo(0.5, node.getPosition()), oldNew))
                this.changeRound();
            }
        }
        else {
            if (this.round == GLB.round.self) {
                // this.oldChessNode.setScale(1);
                this.oldChessNode.getComponent(cc.Animation).play("chessToSmall");
                this.initOldChessNode();
            }
        }
    },
    gameOver() {
        var red, blue, redArr = [], blueArr = [];
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.column; j++) {
                if (this.game[i][j] <= 0) {
                    continue;     //当前位置无动物，返回进行下一次检索
                }
                var open = this.chessArr[i * this.row + j].getComponent("chess").getOpen();
                if (!open) {
                    return;  //只要存在没翻开的就不再遍历
                }
                if (this.game[i][j] > 10) {      //红色11-18
                    red = true;
                    redArr.push(this.game[i][j]);
                }
                else if (this.game[i][j] < 10) {  //蓝色1-8
                    blue = true;
                    blueArr.push(this.game[i][j]);
                }
            }
        }
        if (blueArr.length == 1 && redArr.length == 1) {
            if ((redArr[0] % 10 > blueArr[0]) || (redArr[0] % 10 == 1 && blueArr[0] % 10 == 8)) {
                blue = false;
            }
            else if ((redArr[0] % 10 < blueArr[0]) || (redArr[0] % 10 == 8 && blueArr[0] % 10 == 1)) {
                red = false;
            }
            else {
                red = false;
                blue = false;
            }
        }
        if (!red || !blue) {
            if (!red && !blue) {
                if (this.over == false) {
                    console.log("平局");
                    Game.gameManager.gameState = GameState.over;
                    this.GameVerJs.clearTime();
                    this.over = true;
                    this.scheduleOnce(function () {
                        uiManager.openUI("Result", function (obj) {
                            obj.getComponent("Result").setAuto("00");
                        })
                    }, 2)
                }
            }
            else if (!red) {
                if (this.over == false) {
                    console.log("蓝方胜出")
                    Game.gameManager.gameState = GameState.over;
                    this.GameVerJs.clearTime();
                    this.over = true;
                    this.scheduleOnce(function () {
                        uiManager.openUI("Result", function (obj) {
                            obj.getComponent("Result").setAuto("10");
                        })
                    }, 2)
                }
            }
            else if (!blue) {
                if (this.over == false) {
                    console.log("红方胜出")
                    Game.gameManager.gameState = GameState.over;
                    this.GameVerJs.clearTime();
                    this.over = true;
                    this.scheduleOnce(function () {
                        uiManager.openUI("Result", function (obj) {
                            obj.getComponent("Result").setAuto("01");
                        })
                    }, 2)
                }
            }
            else {
                console.log("空")
            }
        }
    },
    otherOpenChess(sign) {
        console.log("sign:" + sign)
        console.log(this.game)
        var chess = this.getChessBySign(sign);
        chess.getComponent("chess").openChess();
        if (Game.gameManager.showAuto()) {
            this.round = GLB.round.self;
            this.GameVerJs.setTimeNum(30);
            this.GameVerJs.changeTimeColor();
        }
        else {
            this.GameVerJs.clearTime();
            this.changeRound();
        }
        if (GLB.isRoomOwner) {
            this.kongNum = 0;
        }
    },
    otherPlayerEat(eatType, oldSign, newSign) {
        var newX = Math.floor(newSign / this.row);
        var newY = newSign % this.column;
        var oldX = Math.floor(oldSign / this.row);
        var oldY = oldSign % this.column;
        var move = cc.callFunc(function () {
            // oldChess.setScale(1);
            if (oldChess.scale == this.scale) {
                oldChess.getComponent(cc.Animation).play("chessToSmall");
            }
            if (eatType == "equal") {
                this.game[newX][newY] = 0;
                this.game[oldX][oldY] = 0;
                oldChess.getComponent("chess").sign = 100;
                newChess.getComponent("chess").sign = 100;
                oldChess.active = false;
                newChess.active = false;
            }
            else if (eatType == "newOld") {
                this.game[oldX][oldY] = 0;
                oldChess.getComponent("chess").sign = 100;
                oldChess.active = false;
            }
            else if (eatType == "oldNew") {
                this.game[oldX][oldY] = 0
                this.game[newX][newY] = oldChess.getComponent("chess").index;
                oldChess.getComponent("chess").sign = newSign;
                newChess.getComponent("chess").sign = 100;
                newChess.active = false;
            }
            this.GameVerJs.clearTime();
            this.changeRound();
            if (GLB.isRoomOwner) {
                this.kongNum = 0;
            }
        }.bind(this))
        var oldChess = this.getChessBySign(oldSign);
        var newChess = this.getChessBySign(newSign);
        newChess.zindex = 0;
        oldChess.zIndex = newChess.zIndex + 1;
        // oldChess.setScale(1.15)
        oldChess.getComponent(cc.Animation).play("chessToBig");
        oldChess.runAction(cc.sequence(cc.moveTo(0.5, newChess.getPosition()), move));
    },
    otherMoveToKong(chessSign, kongSign) {
        var chess = this.getChessBySign(chessSign);
        var next = this.getNextBySign(kongSign);
        // chess.setScale(1.15);
        chess.getComponent(cc.Animation).play("chessToBig");
        var kongX = Math.floor(kongSign / this.row);     //X行 Y列
        var kongY = kongSign % this.column;
        var chessX = Math.floor(chessSign / this.row);
        var chessY = chessSign % this.column;
        var callback = cc.callFunc(function () {
            this.game[kongX][kongY] = chess.getComponent("chess").index;
            this.game[chessX][chessY] = 0;
            chess.getComponent("chess").sign = next.getComponent("next").sign;
            // chess.setScale(1);
            chess.getComponent(cc.Animation).play("chessToSmall");
            this.initOldChessNode();
            this.GameVerJs.clearTime();
            this.changeRound();
            if (GLB.isRoomOwner) {
                this.kongNum++;
                this.checkKongNum();
            }
        }.bind(this))
        chess.runAction(cc.sequence(cc.moveTo(0.5, next.getPosition()), callback))
    },
    checkKongNum() {
        var zero = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.game[i][j] == 0) {
                    zero++;
                }
            }
        }
        if (zero >= 5) {
            if (this.kongNum == 12) {
                console.log("12步未吃，平局")
                Game.gameManager.gameState = GameState.over;
                this.GameVerJs.clearTime();
                this.scheduleOnce(function () {
                    uiManager.openUI("Result", function (obj) {
                        obj.getComponent("Result").setAuto("00");
                    })
                }, 2)
            }
        }
    },

    getSignByIndex: function (index) {    //用节点的index获取sign  sign:0-15
        for (var i = 0; i < this.chessArr.length; i++) {
            var chessJs = this.chessArr[i].getComponent(this.chess.name);
            if (chessJs.getIndex() === index) {
                return chessJs.sign;
            }
        }
    },
    getChessBySign(sign) {   //用sign获取节点
        for (var i = 0; i < this.chessArr.length; i++) {    //从chessArr中查找
            var chessJs = this.chessArr[i].getComponent(this.chess.name);
            if (chessJs.getSign() === sign) {
                return this.chessArr[i];
            }
        }
    },
    getNextBySign(sign) {
        for (var i = 0; i < this.nextArr.length; i++) {
            var nextJs = this.nextArr[i].getComponent("next");
            if (nextJs.getSign() == sign) {
                return this.nextArr[i];
            }
        }
    },
    autoAction() {
        if (Game.gameManager.gameState !== GameState.play) return
        var testJs = cc.find("Canvas/GameVer/auto").getComponent("auto");
        this.GameVerJs.changePlayerFlag();
        // this.GameVerJs.countTime();
        var time = Math.floor(Math.random() * 8) + 2;
        console.log(time);
        this.scheduleOnce(function () {
            if (this.over == false) {
                testJs.setList();
                testJs.eatChessBlue();            //打开棋子，全打开时，吃或移动
                this.GameVerJs.changePlayerFlag();
                this.gameOver();
                console.log("autoChange")
            }
        }, 3);
    }
});