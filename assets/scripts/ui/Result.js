var GLB = require("Glb");
var mvs = require("Matchvs");
var Net = require("../http");
cc.Class({
    extends: cc.Component,

    properties: {//icon name score
        left: [cc.Node],
        right: [cc.Node],
        btn_lose: cc.SpriteFrame,
        btn_win: cc.SpriteFrame,
        btn_bg: cc.SpriteFrame,
        btn_sprite: cc.Sprite,
        jifen_node: cc.Node,
        all_node: cc.Node,
        fuhao_label: cc.Sprite,
        num_jifen: [cc.SpriteFrame],  //0-9 10:- 11:+
        num_other: [cc.SpriteFrame],
    },

    onLoad() {
        if (GLB.otherPlayerInfo) {
            this.init();
        }
        else {
            this.autoInit();
            Game.gameManager.setAutoFalse();
        }
        // uiManager.addButtonEvent(this.node, "Result", "btn_exit", "Canvas/Result/btn_exit");
        // uiManager.addButtonEvent(this.node, "Result", "btn_choose", "Canvas/Result/btn_choose");
        cc.director.preloadScene("main");
        this.result;
        // cc.find("Canvas/GameVer").destroy();
    },
    init() {
        if (GLB.isRoomOwner) {
            uiManager.setIcon(GLB.playerInfo.avatar, this.left[0]);
            this.left[1].getComponent(cc.Label).string = GLB.playerInfo.userID;
            uiManager.setIcon(GLB.otherPlayerInfo.avatar, this.right[0]);
            this.right[1].getComponent(cc.Label).string = GLB.otherPlayerInfo.userID;
        }
        else {
            uiManager.setIcon(GLB.playerInfo.avatar, this.right[0]);
            this.right[1].getComponent(cc.Label).string = GLB.playerInfo.userID;
            uiManager.setIcon(GLB.otherPlayerInfo.avatar, this.left[0]);
            this.left[1].getComponent(cc.Label).string = GLB.otherPlayerInfo.userID;
        }
    },
    autoInit() {
        uiManager.setIcon(GLB.playerInfo.avatar, this.left[0]);
        this.left[1].getComponent(cc.Label).string = GLB.playerInfo.userID;
        this.right[0].getComponent(cc.Sprite).spriteFrame = Game.gameManager.icon;
        this.right[1].getComponent(cc.Label).string = GLB.autoId;;
    },
    setScore(playerFlag) {
        console.log(playerFlag);
        if (playerFlag == GLB.playerFlag.red) {
            this.setAuto("01")
        }
        else if (playerFlag == GLB.playerFlag.blue) {
            this.setAuto("10")
        }
        else {
            this.setAuto("00");
        }
    },
    setAuto(type) {
        switch (type) {
            case "00":
                this.node.getChildByName("result").getChildByName("result").getChildByName("ping").active = true;
                this.result = "ping";
                break;
            case "10":
                this.left[2].getComponent(cc.Label).string = "1";
                if (GLB.isRoomOwner) {
                    this.node.getChildByName("result").getChildByName("result").getChildByName("win").active = true;
                    uiManager.music("vitory");
                    this.ScoreToTop(1);
                    this.btn_sprite.spriteFrame = this.btn_win;
                    this.result = "win";
                }
                else {
                    this.node.getChildByName("result").getChildByName("result").getChildByName("lose").active = true;
                    uiManager.music("lose");
                    this.ScoreToTop(0);
                    this.btn_sprite.spriteFrame = this.btn_lose;
                    this.result = "lose";
                }
                break;
            case "01":
                this.right[2].getComponent(cc.Label).string = "1";
                if (GLB.isRoomOwner) {
                    this.node.getChildByName("result").getChildByName("result").getChildByName("lose").active = true;
                    uiManager.music("lose");
                    this.ScoreToTop(0);
                    this.btn_sprite.spriteFrame = this.btn_lose;
                    this.result = "lose";
                }
                else {
                    this.node.getChildByName("result").getChildByName("result").getChildByName("win").active = true;
                    uiManager.music("vitory");
                    this.ScoreToTop(1)
                    this.btn_sprite.spriteFrame = this.btn_win;
                    this.result = "win";
                }
                break;
            default:
                break;
        }
        var reqData = { "uid": GLB.playerInfo.userID.toString() }
        Net.send(Constant.Top, reqData, function (response) {
            if (response) {
                console.log(response)
                cc.find("Canvas/Result").getComponent("Result").setResultNum(response.data.member)
            }
        })
    },
    setResultNum(member) {
        //下三行
        this.setOther(member.integral, 0);
        this.setOther(member.rank_number, 1);
        this.setOther3(member.level);
        //上积分结算
        if (this.result == "lose") {
            this.setjifen_fuhao("-");
            this.setjifen_num(100);
        }
        else if (this.result == "win") {
            this.setjifen_fuhao("+");
            this.setjifen_num(100);
        }
        else if (this.result == "ping") {
            this.setjifen_fuhao("+");
            this.setjifen_num(0);
        }
    },
    btn_exit() {
        GLB.otherPlayerInfo = null;
        GLB.autoId = 0;
        var result = mvs.engine.leaveRoom("Result");
        if (result == 0) {
            console.log("成功离开房间");
            this.leaveRoomResponse();
        }
        else {
            console.log("离开房间操作错误")
        }
    },
    leaveRoomResponse() {
        Game.gameManager.gameState = GameState.over;
        cc.director.loadScene("main", function () {
            cc.find("Canvas/Lobby").getComponent("Lobby").initUser();
        });
    },
    btn_choose(event) {    //点击第一个按钮，弹出窗口看广告，看完之后  不减分或是积分翻倍
        event.target.getComponent(cc.Button).interactable = false;
        event.target.children[0].getComponent(cc.Sprite).spriteFrame = this.btn_bg;
        this.ScoreToTop(1);

    },
    ScoreToTop(num) {//加一分的消息   win1 lose 0
        //####结算####
        console.log("分数加减",num)
        var reqData = { "uid": GLB.playerInfo.userID.toString(), win: num }
        Net.send(Constant.RESULT, reqData, function (response) {
            if (response) {
                console.log(response)
            }
        })
    },
    setjifen_fuhao(fuhao) {
        var n = 0;
        if (fuhao == "-") {
            n = 10
        }
        else if (fuhao == "+") {
            n = 11;
        }
        this.fuhao_label.getComponent(cc.Sprite).spriteFrame = this.num_jifen[n];
    },
    setjifen_num(num) {
        this.jifen_node.getComponent(cc.Label).string=num;
        // var label = num;
        // while (label > 0) {
        //     var n = label % 10;
        //     label = (label - label % 10) / 10;
        //     var node = new cc.Node();
        //     node.addComponent(cc.Sprite);
        //     node.getComponent(cc.Sprite).spriteFrame = this.num_jifen[n];
        //     this.jifen_node.addChild(node);
        // }
    },
    setOther(num, i) {
        var label = num;
        if(label==0){
            var node = new cc.Node();
            node.addComponent(cc.Sprite);
            node.getComponent(cc.Sprite).spriteFrame = this.num_other[0];
            this.all_node.children[i].addChild(node);
            return;
        }
        while (label > 0) {
            var n = label % 10;
            label = (label - label % 10) / 10;
            var node = new cc.Node();
            node.addComponent(cc.Sprite);
            node.getComponent(cc.Sprite).spriteFrame = this.num_other[n];
            this.all_node.children[i].addChild(node);
        }
    },
    setOther3(label) {
        this.all_node.children[2].getComponent(cc.Label).string = label;
    }

});
