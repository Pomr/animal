var GLB = require("Glb")
var mvs = require("Matchvs")
var Net = require("../http");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {        
        uiManager.addButtonEvent(this.node, "Lobby", "btn_matching", "Canvas/Lobby/btn_matching")
        uiManager.addButtonEvent(this.node, "Lobby", "btn_createRoom", "Canvas/Lobby/btn_createRoom")
        uiManager.addButtonEvent(this.node, "Lobby", "btn_joinRoom", "Canvas/Lobby/btn_joinRoom")
        // uiManager.addButtonEvent(this.node, "Lobby", "btn_exit", "Canvas/Lobby/btn_exit")
        uiManager.addButtonEvent(this.node, "Lobby", "btn_top", "Canvas/Lobby/btn_top")
        uiManager.addButtonEvent(this.node, "Lobby", "btn_rule", "Canvas/Lobby/btn_rule");
    },

    initUser() {
        var nameLabel = this.node.getChildByName("user").getChildByName("user_name").getComponent(cc.Label);   //获取名称、头像
        var iconNode = this.node.getChildByName("user").getChildByName("mask").getChildByName("user_Icon");
        nameLabel.string = GLB.playerInfo.userID;
        uiManager.setIcon(GLB.playerInfo.avatar, iconNode);
    },
    btn_rule(){
        uiManager.openUI("Rule");
    },
    btn_matching() {      //随机匹配
        GLB.matchType = GLB.RANDOM_MATCH;     //参数--随机匹配
        var result = mvs.engine.joinRandomRoom(GLB.maxPlayer, GLB.playerInfo.avatar);
        if (result == 0) {
            console.log("进入随机匹配")
        }
        else {
            console.log("错误信息：" + result);
        }
    },
    randomMatching(roomUserInfoList, roomInfo) {
        uiManager.openUI("Matching", function (obj) {
            var matching = obj.getComponent("Matching");
            matching.randomRoom(roomUserInfoList, roomInfo);
        });
    },
    btn_createRoom() {
        uiManager.openUI("CreateRoom")
    },
    btn_joinRoom() {
        GLB.matchType = GLB.PROPERTY_MATCH;
        uiManager.openUI("JoinRoom")
    },
    btn_exit() {
        mvs.engine.logout("");
    },
    btn_top() {              //排行榜
        //####排行榜####
        var reqData={"uid":GLB.playerInfo.userID.toString()}
        Net.send(Constant.Top,reqData,function(response){
            if(response){
                console.log(response)
                uiManager.openUI("Top",function(obj){
                    var topJs = obj.getComponent("Top");
                    topJs.setTopList(response.data.list);
                    topJs.setSelfData(response.data.member)
                })
            }
        })
    },
    onEnable() {  //显示时运行
        GLB.isRoomOwner = false;
    },
});
