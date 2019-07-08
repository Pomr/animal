cc.Class({
    extends: cc.Component,

    properties: {
        b_sprite:cc.Sprite,
        s:[cc.Sprite],
        level0:[cc.SpriteFrame],
        level1:[cc.SpriteFrame],
        level2:[cc.SpriteFrame],
        level3:[cc.SpriteFrame],
        level4:[cc.SpriteFrame],
        level5:[cc.SpriteFrame],
    },

    // onLoad () {
    // },

    setData(num){
        if(num==0){
            this.b_sprite.spriteFrame=this.level0[0];
            this.s[0].spriteFrame=this.level0[1];
            this.s[1].spriteFrame=this.level0[1];
            this.s[2].spriteFrame=this.level0[1];
        }
        else if(num==1){
            this.b_sprite.spriteFrame=this.level1[0];
            this.s[0].spriteFrame=this.level1[1];
            this.s[1].spriteFrame=this.level1[1];
            this.s[2].spriteFrame=this.level1[1];
        }
        else if(num==2){
            this.b_sprite.spriteFrame=this.level2[0];
            this.s[0].spriteFrame=this.level2[1];
            this.s[1].spriteFrame=this.level2[1];
            this.s[2].spriteFrame=this.level2[1];
        }
        else if(num==3){
            this.b_sprite.spriteFrame=this.level3[0];
            this.s[0].spriteFrame=this.level3[1];
            this.s[1].spriteFrame=this.level3[1];
            this.s[2].spriteFrame=this.level3[1];
        }
        else if(num==4){
            this.b_sprite.spriteFrame=this.level4[0];
            this.s[0].spriteFrame=this.level4[1];
            this.s[1].spriteFrame=this.level4[1];
            this.s[2].spriteFrame=this.level4[1];
        }
        else if(num==5){
            this.b_sprite.spriteFrame=this.level5[0];
            this.s[0].spriteFrame=this.level5[1];
            this.s[1].spriteFrame=this.level5[1];
            this.s[2].spriteFrame=this.level5[1];
        }
    }

    // update (dt) {},
});
