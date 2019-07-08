
cc.Class({
    extends: cc.Component,

    properties: {
        list:cc.Node,
        selfNode:cc.Node,
        scoreHeng:cc.Prefab,
        top1:[cc.Node],    //icon name score
        top2:[cc.Node],
        top3:[cc.Node],
        self:[cc.Node],   //icon name score topnum
    },

    onLoad () {  
        // uiManager.addButtonEvent(this.node,"Top","btn_return","Canvas/Top/btn_return")
        this.top123=[this.top1,this.top2,this.top3];
    },

    createScore(){    //4-n名次
        var one=cc.instantiate(this.scoreHeng);
        one.getComponent("scoreHeng").setData(num.icon,name,score);
        this.list.addChild(one);
    },
    setSelfData(member){    //self
        this.selfNode.getComponent("scoreHeng").setData(member.rank_number,member.uid,member.level,member.integral);
    },
    setTopList: function(list) {
        for (var i = 0; i < list.length; i++) {
            if (i < 3) { //icon name score
                this.top123[i][1].getComponent(cc.Label).string=list[i].uid;
                this.top123[i][2].getComponent(cc.Label).string=list[i].integral;
            } 
            else {
                var other = cc.instantiate(this.scoreHeng);
                other.getComponent("scoreHeng").setData(list[i].rank_number,list[i].uid, list[i].level,list[i].integral);
                this.list.addChild(other);
            }
        }
    },

    btn_return(){
        this.node.destroy();
    }
});
