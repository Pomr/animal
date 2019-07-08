var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.on("click", this.joinRoom, this);
    },

    setData: function (msRoomAttribute) {
        this.msRoomAttribute = msRoomAttribute;
        this.node.getChildByName("roomId").getComponent(cc.Label).string = msRoomAttribute.roomID.substr(msRoomAttribute.roomID.length-5);
        this.node.getChildByName("roomName").getComponent(cc.Label).string = msRoomAttribute.roomName;
    },

    joinRoom: function () {
        mvs.engine.joinRoom(this.msRoomAttribute.roomID, GLB.playerInfo.avatar);
    }

});