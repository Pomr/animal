var GLB = require("Glb");
var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        left: [cc.Node],
        right: [cc.Node],
    },

    onLoad() {
        uiManager.addButtonEvent(this.node, "GameVer", "btn_exit", "Canvas/GameVer/btn_exit")
        if (GLB.otherPlayerInfo) {
            this.initPlayer();
        }
        else {
            this.initAutoInfo();
            this.initreadyGo();
        }
        this.playerFlag;
    },
    initAutoInfo() {
        uiManager.setIcon(GLB.playerInfo.avatar, this.left[0]);
        this.right[0].getComponent(cc.Sprite).spriteFrame = Game.gameManager.icon;
        this.left[1].getComponent(cc.Label).string = GLB.playerInfo.userID;
        this.right[1].getComponent(cc.Label).string = GLB.autoId;
        this.playerFlag = GLB.playerFlag.blue;
    },
    changePlayerFlag() {
        this.playerFlag === GLB.playerFlag.red ? this.playerFlag = GLB.playerFlag.blue : this.playerFlag = GLB.playerFlag.red
    },
    initPlayer() {   //icon name  右边icon没显示
        if (GLB.isRoomOwner) {     //左边红色 房主
            uiManager.setIcon(GLB.playerInfo.avatar, this.left[0]);
            uiManager.setIcon(GLB.otherPlayerInfo.avatar, this.right[0]);
            this.left[1].getComponent(cc.Label).string = GLB.playerInfo.userID;
            this.right[1].getComponent(cc.Label).string = GLB.otherPlayerInfo.userID;
            this.playerFlag = GLB.playerFlag.blue;
        }
        else {
            uiManager.setIcon(GLB.playerInfo.avatar, this.right[0]);
            uiManager.setIcon(GLB.otherPlayerInfo.avatar, this.left[0]);
            this.right[1].getComponent(cc.Label).string = GLB.playerInfo.userID;
            this.left[1].getComponent(cc.Label).string = GLB.otherPlayerInfo.userID;
            this.playerFlag = GLB.playerFlag.red;
        }
    },
    initreadyGo() {
        /*当readygo之后 自己倒计时自己的，
        1.某一方的倒计时结束，则另一方胜利
        2.一个回合结束，下一回合重置时间
        */
        this.node.getChildByName("readyGo").active = true;
        this.node.getChildByName("readyGo").getComponent(cc.Animation).play();
        this.node.getChildByName("readyGo").getComponent(cc.AudioSource).play();
        this.node.getChildByName("readyGo").getComponent(cc.Animation).on('finished', function () {
            cc.find("Canvas/GameVer/readyGo").active = false;
            Game.gameManager.gameState = GameState.play;
            if (GLB.isRoomOwner) {
                cc.find("Canvas/GameVer").getComponent("GameVer").countTime();
                cc.find("Canvas/GameVer").getComponent("GameVer").timeInit();
            }
            else {
                cc.find("Canvas/GameVer").getComponent("GameVer").timeInit();
                cc.find("Canvas/GameVer").getComponent("GameVer").countTime();
            }
        })
    },
    timeInit() {
        cc.find("Canvas/GameVer/time").active = true;
        cc.find("Canvas/GameVer/head/leftRound").active = !cc.find("Canvas/GameVer/head/leftRound").active;
        if (GLB.isRoomOwner) {
            cc.find("Canvas/GameVer/head/rightRound/label").getComponent(cc.Label).string = "轮到对方了";
        }
        else {
            cc.find("Canvas/GameVer/head/leftRound/label").getComponent(cc.Label).string = "轮到对方了";
        }
    },
    showPlayerFlag() {
        return this.playerFlag;
    },
    changeTimeColor() {
        cc.find("Canvas/GameVer/time").getComponent(cc.ProgressBar).progress = 1;
        cc.find("Canvas/GameVer/head/leftRound").active = !cc.find("Canvas/GameVer/head/leftRound").active;
        cc.find("Canvas/GameVer/head/rightRound").active = !cc.find("Canvas/GameVer/head/leftRound").active;
        cc.find("Canvas/GameVer/head/leftRound/num").getComponent(cc.Label).string = 30;
        cc.find("Canvas/GameVer/head/rightRound/num").getComponent(cc.Label).string = 30;
    },
    clearTime() {
        clearInterval(this.interval);
    },
    countTime() {
        clearInterval(this.interval);
        if (Game.gameManager.gameState !== GameState.play) return;
        this.time = 30;
        this.interval = setInterval(function () {     //setInterval载入后每隔一定事件一定调用，setTimeout会等待前面程序执行完再调用
            this.setTimeNum(this.time);
            this.time--;
            if (this.time <= 0) {
                this.clearTime();
                if (Game.gameManager.gameState === GameState.play) {
                    if (cc.find("Canvas/GameVer/game").getComponent("game").round == GLB.round.self) {
                        console.log('超时；获胜方====' + (this.playerFlag === GLB.playerFlag.red ? '蓝色' : '红色'));
                        var winFlag = this.playerFlag === GLB.playerFlag.red ? GLB.playerFlag.blue : GLB.playerFlag.red
                        uiManager.openUI("Result", function (obj) {
                            obj.getComponent("Result").setScore(winFlag);
                        })
                    }
                    else{
                        console.log('超时；获胜方====' + (this.playerFlag === GLB.playerFlag.red ? '红色' : '蓝色'));
                        var winFlag = this.playerFlag === GLB.playerFlag.red ? GLB.playerFlag.red : GLB.playerFlag.blue
                        uiManager.openUI("Result", function (obj) {
                            obj.getComponent("Result").setScore(winFlag);
                        })
                    }
                }
                this.interval = null;
            }
        }.bind(this), 1000);
    },
    setTimeNum(num) {
        cc.find("Canvas/GameVer/time").getComponent(cc.ProgressBar).progress = num / 30;
        if (GLB.isRoomOwner) {
            if (cc.find("Canvas/GameVer/game").getComponent("game").round == GLB.round.self) {
                cc.find("Canvas/GameVer/head/leftRound/num").getComponent(cc.Label).string = num;
            }
            else {
                cc.find("Canvas/GameVer/head/rightRound/num").getComponent(cc.Label).string = num;
            }
        }
        else {
            if (cc.find("Canvas/GameVer/game").getComponent("game").round != GLB.round.self) {
                cc.find("Canvas/GameVer/head/leftRound/num").getComponent(cc.Label).string = num;
            }
            else {
                cc.find("Canvas/GameVer/head/rightRound/num").getComponent(cc.Label).string = num;
            }
        }
    },
    leaveRoomNotify(res) {   //另外一个人退出 自己赢
        this.clearTime()
        uiManager.openUI("Tip", function (obj) {
            var uiTip = obj.getComponent("Tip");
            if (uiTip) {
                uiTip.setData(3);
            }
            obj.getComponent(cc.Animation).on('finished', function () {
                var GameVerJs = cc.find("Canvas/GameVer").getComponent("GameVer");
                var playerFlag = GameVerJs.showPlayerFlag();
                var winFlag = playerFlag === GLB.playerFlag.red ? GLB.playerFlag.red : GLB.playerFlag.blue;
                uiManager.openUI("Result", function (obj) {
                    obj.getChildByName("result").getChildByName("result").getChildByName("win").active = true;
                    obj.getComponent("Result").setScore(winFlag);
                })
            })
        })
    },
    btn_exit() {
        uiManager.openUI("ExitGame");
    },
});
