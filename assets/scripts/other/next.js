var GLB=require("Glb")
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        this.sign=0;    // 0-15
        this.node.on("touchend",this.chessMoveKong,this);
        this.gameJs=cc.find("Canvas/GameVer/game").getComponent("game");
    },

    setNextSign:function (sign) {
        this.sign=sign
    },

    chessMoveKong(){
        if(Game.gameManager.gameState!==GameState.play) return;
        if(this.gameJs.round!==GLB.round.self){
            return;
        }
        this.gameJs.chessMoveKong(this.node);
    },
    getSign(){
        return this.sign;
    },
});
