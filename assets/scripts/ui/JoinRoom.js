var mvs=require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        prefab_room:cc.Prefab,
        listNode:cc.Node,
    },

    onLoad () {
        uiManager.addButtonEvent(this.node,"JoinRoom","btn_start","Canvas/JoinRoom/room/btn_start");
        uiManager.addButtonEvent(this.node,"JoinRoom","btn_exit","Canvas/JoinRoom/btn_exit");
        this.initRoomList();
        this.rooms = [];
        this.editBox=this.node.getChildByName("room").getChildByName("editBox").getComponent(cc.EditBox);
        this.roomRqId = setInterval(function() {
            if (this.editBox.string === '') {
                this.initRoomList();
            }
        }.bind(this), 2000);
    },
    initRoomList(){
        var filter = {
            maxPlayer: 0,
            mode: 0,
            canWatch: 0,
            roomProperty: "",
            full: 2,
            state: 1,
            sort: 1,
            order: 0,
            pageNo: 0,
            pageSize: 20
        }
        mvs.engine.getRoomList(filter);
    },

    onDestroy() {
        clearInterval(this.roomRqId);
    },
    getRoomListResponse(res){
        for(var i=0;i<this.listNode.childrenCount;i++){
            this.listNode.children[i].destroy();
        }
        this.roomList=[];
        for(var i=0;i<res.roomInfos.length;i++){
            var room=cc.instantiate(this.prefab_room);
            room.getComponent("roomInfo").setData(res.roomInfos[i]);
            this.listNode.addChild(room)
            this.roomList.push(room)
        }
    },
    


    btn_exit(){
        clearInterval(this.roomRqId);
        this.node.destroy();
    },
    btn_start(){
        if (this.editBox.string === '') {
            for (var i = 0; i < this.roomList.length; i++) {
                this.roomList[i].active = true;
            }
        } else {
            for (var j = 0; j < this.roomList.length; j++) {
                var roomId = this.roomList[j].getChildByName("roomId").getComponent(cc.Label).string;
                if (roomId == this.editBox.string) {
                    this.roomList[j].active = true;
                } else {
                    this.roomList[j].active = false;
                }
            }
        }
    },

    /*
    0:MsRoomAttribute {roomID: "1769048949882097676", roomName: "", maxPlayer: 2, gamePlayer: 1, watchPlayer: 0, …}
1: MsRoomAttribute {roomID: "1769048949882097680",
    */

});
