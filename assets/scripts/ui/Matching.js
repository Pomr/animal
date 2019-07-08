var GLB = require("Glb")
var mvs = require("Matchvs")
cc.Class({
    extends: cc.Component,

    properties: {
        leftIconNode: cc.Node,
        rightIconNode: cc.Node,
        leftIdLabel: cc.Label,
        rightIdLabel: cc.Label,
        autoStart:1,
    },

    onLoad() {
        uiManager.addButtonEvent(this.node, "Matching", "btn_exit", "Canvas/Matching/btn_exit");
        this.playerList = [];
        this.numToAuto = 0;
        this.autoCheck=false;
        this.start=false;
        var timeLabel=cc.find("Canvas/Matching/title/time/label").getComponent(cc.Label);
        this.schedule(function () {
            /*进入与机器人游戏模式
        房间中人物为“1”，关闭房间，跳转界面，开始游戏，
        game设置一个机器人变量
        */
       if(this.start==true){
           return;
       }
            this.numToAuto++;
            timeLabel.string=this.numToAuto;
            if (this.numToAuto == this.autoStart) {
                this.joinAuto();
                mvs.engine.joinOver("Auto");
                cc.find("Canvas/Matching/btn_exit").active = false;
                cc.director.preloadScene("game");
                GLB.isRoomOwner = true;
                this.autoCheck = true;
            }
        }, 1);
    },
    randomRoom(roomUserInfoList, roomInfo) {           //owner
        if (roomUserInfoList.length == 0) {
            this.setLeftUserInfo(GLB.playerInfo.avatar, GLB.playerInfo.userID);
            this.playerList.push(GLB.playerInfo.userID)
            GLB.isRoomOwner = true;
        }
        else {     //length==1
            this.setLeftUserInfo(roomUserInfoList[0].userProfile, roomUserInfoList[0].userID);
            GLB.otherPlayerInfo = { avatar: roomUserInfoList[0].userProfile, userID: roomUserInfoList[0].userID };
            this.setRightUserInfo(GLB.playerInfo.avatar, GLB.playerInfo.userID);
            this.playerList.push(roomUserInfoList[0].userID);
            this.playerList.push(GLB.playerInfo.userID);
            mvs.engine.joinOver("Matching");
            this.start=true;
            this.node.getChildByName("title").getChildByName("succ").active=true;
        this.node.getChildByName("btn_exit").active=false;
        }
        
    },
    setLeftUserInfo(avatar, id) {
        uiManager.setIcon(avatar, this.leftIconNode);
        this.leftIdLabel.string = id;
    },
    setRightUserInfo(avatar, id) {
        uiManager.setIcon(avatar, this.rightIconNode);
        this.rightIdLabel.string = id;
    },
    btn_exit() {
        var result = mvs.engine.leaveRoom("Matching");
        if (result == 0) {
            console.log("成功离开房间");
            this.leaveRoomResponse();
        }
        else {
            console.log("离开房间操作错误")
        }
    },
    joinAuto() {
        this.rightIconNode.getComponent(cc.Sprite).spriteFrame = Game.gameManager.icon;
        var autoId = Math.floor(Math.random() * 9999999);
        if (autoId == GLB.playerInfo.userID) {
            autoId++;
        }
        GLB.autoId = autoId;
        this.rightIdLabel.string = GLB.autoId;
    },
    joinOtherPlayer(userInfo) {
        this.start=true;
        this.setRightUserInfo(userInfo.userProfile, userInfo.userID)
        this.playerList.push(userInfo.userID);
        mvs.engine.joinOver("Matching");
        GLB.otherPlayerInfo = { avatar: userInfo.userProfile, userID: userInfo.userID };
        this.node.getChildByName("title").getChildByName("succ").active=true;
        this.node.getChildByName("btn_exit").active=false;
        // console.log(GLB.otherPlayerInfo);
    },
    leaveRoomResponse() {
        var no = this.playerList.indexOf(GLB.playerInfo.userID);
        if (no == 0) {
            this.setLeftUserInfo("", "");
        }
        else if (no = 1) {
            this.setRightUserInfo("", "");
        }
        this.playerList.splice(no, 1);
        this.node.destroy();
    },

    // update (dt) {},
});
