var GLB = require("Glb");
var mvs = require("Matchvs")
cc.Class({
    extends: cc.Component,

    properties: {
        owner:cc.Node,
        IdNode: cc.Node,
        kickNode: cc.Node,
        iconNode: cc.Node,
    },

    onLoad() {
        this.init();
        this.kickNode.on("click", this.kickPlayer, this);
    },
    init() {
        this.userId = 0;
        this.iconNode.active = false;
        this.IdNode.active = false;
        this.kickNode.active = false;
        this.owner.active=false;
    },



    setData(userId, ownerId, avatar) {
        this.userId = userId;
        if (this.userId === ownerId) {
            this.owner.active = true;
        } 
        else {
            this.owner.active = false;
        }
        this.IdNode.getComponent(cc.Label).string = this.userId;
        this.IdNode.active = true;
        uiManager.setIcon(avatar, this.iconNode);
        this.iconNode.active = true;
        if (!GLB.isRoomOwner || this.userId === GLB.playerInfo.userID) {
            this.kickNode.active = false;
        } else {
            this.kickNode.active = true;
        }
    },

    setOwner(){
        this.owner.active = true;
    },
    kickPlayer: function () {
        mvs.engine.kickPlayer(this.userId, "kick");
    }

    // update (dt) {},
});
