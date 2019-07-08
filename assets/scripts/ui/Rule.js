cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        uiManager.addButtonEvent(this.node, "Rule", "btn_return", "Canvas/Rule/btn_return");
    },

    btn_return(){
        this.node.destroy();
    }

    // update (dt) {},
});
