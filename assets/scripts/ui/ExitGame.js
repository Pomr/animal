var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        uiManager.addButtonEvent(this.node, "ExitGame", "btn_exit", "Canvas/ExitGame/title/btn_exit")
        uiManager.addButtonEvent(this.node, "ExitGame", "btn_return", "Canvas/ExitGame/title/btn_return")
    },
    btn_exit() {
        mvs.engine.leaveRoom("ExitGame");
        this.leaveRoomResponse();
    },
    btn_return() {
        this.node.destroy();
    },   
    leaveRoomResponse() {
        Game.gameManager.gameState=GameState.over;
        cc.find("Canvas/GameVer").getComponent("GameVer").clearTime(); 
        cc.director.loadScene("main",function(){
            cc.find("Canvas/Lobby").getComponent("Lobby").initUser();
        });
        if(Game.gameManager.showAuto()){
            Game.gameManager.setAutoFalse();
        }
    },
});
