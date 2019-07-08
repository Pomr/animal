var GLB = require("Glb");
var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        playerList: [cc.Node],
    },

    onLoad() {
        uiManager.addButtonEvent(this.node, "Room", "btn_exit", "Canvas/Room/btn_exit");
        uiManager.addButtonEvent(this.node, "Room", "btn_start", "Canvas/Room/title/btn_start");
        this.kong;
        this.init();
    },
    init(){
        if (i18n.curLang=="English") {
            for(var i=0;i<this.playerList.length;i++){
                this.playerList[i].getChildByName("owner").getChildByName("type").width=120;
                this.playerList[i].getChildByName("self").getChildByName("type").width=20;
                this.playerList[i].getChildByName("other").getChildByName("type").width=120;
            }
        }
    },
    createRoom(roomOwner) {     //建房 空的为右边 1
        for (var i = 0; i < this.playerList.length; i++) {
            var playerJs = this.playerList[i].getComponent("roomPlayer");
            if (playerJs.userId == 0) {       //建房的id
                playerJs.setData(GLB.playerInfo.userID, roomOwner, GLB.playerInfo.avatar)
                GLB.isRoomOwner = true;
                this.playerList[0].getChildByName("btn_kick").active=false;
                this.kong = 1;
                break;
            }
        }
    },
    joinRoom(roomUserInfoList, roomInfo) {
        if (roomUserInfoList.length == 1) {
            for (var i = 0; i < this.playerList.length; i++) {
                var playerJs = this.playerList[i].getComponent("roomPlayer");
                if (i == 0) {       //默认房间左边的位置是房主
                    playerJs.setData(roomUserInfoList[i].userID, roomInfo.ownerId, roomUserInfoList[i].userProfile);
                    GLB.otherPlayerInfo = { avatar: roomUserInfoList[i].userProfile, userID: roomUserInfoList[i].userID };
                }
                else if (i == 1) {
                    playerJs.setData(GLB.playerInfo.userID, roomInfo.ownerId, GLB.playerInfo.avatar);
                }
            }
            this.kong = -1;
        }
    },
    joinOtherPlayer(userInfo) {
        if (this.kong !== -1) {
            var playerJs = this.playerList[this.kong].getComponent("roomPlayer")
            playerJs.setData(userInfo.userID, GLB.playerInfo.userID, userInfo.userProfile);
            this.kong = -1;
            GLB.otherPlayerInfo = { avatar: userInfo.userProfile, userID: userInfo.userID };
        }
    },
    kickPlayerResponse(res) {
        if (res.owner !== res.userID) {
            for (var i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i].getComponent("roomPlayer").userId == res.userID) {
                    this.playerList[i].getComponent("roomPlayer").init();
                    this.kong = i;
                }
            }
        }
    },
    kickPlayerNotify(res) {
        if (res.srcUserID == res.owner && res.userID == GLB.playerInfo.userID) {
            for (var i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i].getComponent("roomPlayer").userId == res.userID) {
                    this.playerList[i].getComponent("roomPlayer").init();
                    this.node.destroy();
                }
            }
        }
    },

    btn_start() {
        if (!GLB.isRoomOwner) {
            uiManager.openUI("Tip", function (obj) {
                var tip = obj.getComponent("Tip");
                if (tip) {
                    tip.setData(4);
                }
            }.bind(this));
            return;
        }
        if (this.kong == -1 && GLB.isRoomOwner) {
            var res = mvs.engine.sendEvent("game");
            mvs.engine.joinOver("");
            cc.director.loadScene("game");
        }
        else {
            uiManager.openUI("Tip", function (obj) {
                obj.getComponent("Tip").setData(5);
            })
        }
    },
    btn_exit() {
        var result = mvs.engine.leaveRoom("Room");
        if (GLB.isRoomOwner) {
            this.kong = 0;
        }
        else {
            this.kong = 1;
        }
        if (result == 0) {
            console.log("成功离开房间");
            this.leaveRoomResponse();
        }
        else {
            console.log("离开房间操作错误")
        }
    },
    leaveRoomResponse() {
        for (var i = 0; i < this.playerList.length; i++) {
            var playerJs = this.playerList[i].getComponent("roomPlayer");
            playerJs.init();              //离开的格子变空
            if (GLB.isRoomOwner) {
                GLB.isRoomOwner = false;
            }
        }
        this.node.destroy();
    },
    leaveRoomNotify(res) {
        for (var i = 0; i < this.playerList.length; i++) {
            var playerJs = this.playerList[i].getComponent("roomPlayer");
            if (playerJs.userId == res.userID) {
                playerJs.init();             //离开的格子变空
                this.kong = i;
            }
            else if (playerJs.userId == res.owner) {
                GLB.isRoomOwner = true;
                playerJs.setOwner();
            }
        }
    },
    //开始游戏 gameState=Play   lobby=None
});
