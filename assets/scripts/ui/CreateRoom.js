var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        uiManager.addButtonEvent(this.node, "CreateRoom", "btn_determine", "Canvas/CreateRoom/title/btn_determine")
        uiManager.addButtonEvent(this.node, "CreateRoom", "btn_exit", "Canvas/CreateRoom/btn_exit")
    },

    btn_determine() {
        GLB.matchType = GLB.PROPERTY_MATCH;
        Game.gameManager.blockInputEvents();      //一秒的遮罩
        var roomInfo = new mvs.CreateRoomInfo();
        var roomName = this.node.getChildByName("title").getChildByName("input_roomName").getComponent(cc.EditBox);
        roomInfo.roomName = roomName.string;
        roomInfo.maxPlayer = GLB.maxPlayer;
        roomInfo.mode = 0;
        roomInfo.canWatch = 2;
        roomInfo.visibility = 1;
        roomInfo.roomProperty = GLB.maxPlayer;
        var result = mvs.engine.createRoom(roomInfo, GLB.playerInfo.avatar);
        if (result !== 0) {
            console.log("创建房间失败，错误码：" + result);
        }
    },
    createRoomResponse(roomOwner) {
        //创建房间成功 返回消息
        uiManager.openUI("Room", function (obj) {
            var room = obj.getComponent('Room');
            room.createRoom(roomOwner);
            GLB.isRoomOwner=true;
        }.bind(this));
        this.node.destroy();
    },
    btn_exit() {
        this.node.destroy();
    },

    // update (dt) {},
});
