var GLB=require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {
        numLabel: cc.Label,
        nameLabel: cc.Label,
        scoreLabel: cc.Label,
        topSprite:cc.Prefab,
    },

    setData(num, name, level,integral) {   //排名，名称，score换为中文 兽王3星（积分：1000）
        this.numLabel.string = num;
        this.nameLabel.string = name;
        var topName=level+" ( 积分 "+ integral +" )";
        this.scoreLabel.string = topName;
        var i=this.checkTop(level);
        var topSprite = cc.instantiate(this.topSprite);
        topSprite.getComponent("topSprite").setData(1);
        this.node.addChild(topSprite);
    },
    checkTop(level){
        for(var i=0;i<GLB.top.length;i++){
            if(GLB.top[i]==level){
                return i;
            }
        }
    },

});
