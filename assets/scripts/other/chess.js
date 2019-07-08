var GLB = require("Glb")
cc.Class({
    extends: cc.Component,

    properties: {
        animalArr: [cc.SpriteFrame],
        colorArr: [cc.SpriteFrame],
        nameChineseArr: [cc.SpriteFrame],
        nameEnglishArr: [cc.SpriteFrame],
    },

    onLoad() {
        this.open = false;
        this.sign = 0;
        this.node.on("touchend", this.chessTouch, this);
        this.leftNode = this.node.getChildByName('left');
        this.rightNode = this.node.getChildByName('right');
        this.upNode = this.node.getChildByName('up');
        this.downNode = this.node.getChildByName('down');
        this.gameJs;
    },

    setChess(type, index) {      //type->1 为red  type-> 0为blue
        this.gameJs = cc.find("Canvas/GameVer/game").getComponent("game");
        var colorSprite = this.node.getChildByName("animalColor").getComponent(cc.Sprite);
        var animalSprite = this.node.getChildByName("animalColor").getChildByName("animal").getComponent(cc.Sprite);
        var nameNode = this.node.getChildByName("animalColor").getChildByName("name");
        var nameSprite = nameNode.getComponent(cc.Sprite);
        colorSprite.spriteFrame = this.colorArr[type];
        animalSprite.spriteFrame = this.animalArr[index % 10 - 1];
        // if (i18n.curLang == "Chinese") {
            nameSprite.spriteFrame = this.nameChineseArr[index % 10 - 1];
        // }
        // else {
        //     nameSprite.spriteFrame = this.nameEnglishArr[index % 10 - 1];
        // }
        this.type = type;
        this.index = index;
    },

    chessTouch(event) {
        if (Game.gameManager.gameState !== GameState.play) return;
        if (this.gameJs.round !== GLB.round.self) {
            return;
        }
        if (this.getOpen()) {
            this.gameJs.chessMove(event.target);
        }
        else {   //删除上面挡住的图片
            this.initAllChessScale()
            this.openChess();
            Game.gameManager.sendEvent("open", this.sign);
            cc.find("Canvas/GameVer/game").getComponent("game").changeRound();
            uiManager.music(this.index % 10 - 1)
            if (GLB.isRoomOwner) {
                cc.find("Canvas/GameVer/game").getComponent("game").kongNum = 0;
            }
        }
    },
    openChess() {
        this.setOpen();
        this.node.getChildByName("bg").getComponent(cc.Animation).play().once("finished", function () {
            this.node.getChildByName("bg").destroy()
        }.bind(this));
        this.gameJs.initOldChessNode();
        // this.gameJs.gameOver();
        // console.log("openChess");
    },
    initAllChessScale() {
        var chessNode = this.node.parent.children;
        for (var i = 0; i < chessNode.length; i++) {
            chessNode[i].setScale(1);
        }
    },
    setMoveColor: function (data) {
        if (data.left) {
            this.leftNode.active = data.left;
            if (data.largeThanleft) {
                this.leftNode.color = new cc.color("#FFFFFF");
            }
            else {
                this.leftNode.color = new cc.color("#FF4E4E");
            }
        }
        if (data.right) {
            this.rightNode.active = data.right;
            if (data.largeThanright) {
                this.rightNode.color = new cc.color("#FFFFFF");
            }
            else {
                this.rightNode.color = new cc.color("#FF4E4E");  //红色
            }
        }
        if (data.up) {
            this.upNode.active = data.up;
            if (data.largeThanup) {
                this.upNode.color = new cc.color("#FFFFFF");
            }
            else {
                this.upNode.color = new cc.color("#FF4E4E");
            }
        }
        if (data.down) {
            this.downNode.active = data.down;
            if (data.largeThandown) {
                this.downNode.color = new cc.color("#FFFFFF");
            }
            else {
                this.downNode.color = new cc.color("#FF4E4E");
            }
        }
    },
    setChessSign(sign) {
        this.sign = sign;
    },
    hideMove() {
        this.leftNode.active = false;
        this.rightNode.active = false;
        this.upNode.active = false;
        this.downNode.active = false;
        this.node.getChildByName("check").active = false;
    },
    getIndex() {
        return this.index;
    },
    getSign() {
        return this.sign;
    },
    setOpen() {
        var chessAll = this.node.parent.children;
        for (var i = 0; i < chessAll.length; i++) {
            chessAll[i].getChildByName("left").active = false;
            chessAll[i].getChildByName("right").active = false;
            chessAll[i].getChildByName("up").active = false;
            chessAll[i].getChildByName("down").active = false;
            chessAll[i].getChildByName("check").active = false;
        }
        this.open = true;
    },
    getOpen() {
        return this.open;
    },

});
