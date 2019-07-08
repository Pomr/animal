var GLB = require("Glb");
cc.Class({
    extends: cc.Component,
    properties: {
        roundChinese: [cc.SpriteFrame],
        roundEnglish: [cc.SpriteFrame],
    },

    onLoad() {

    },

    setData(whichOne) {
        var sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        if (whichOne === GLB.round.self) {
            this.node.getComponent(cc.Animation).play("roundSelf").on('finished', this.animationFinished.bind(this));
            if (i18n.curLang == GLB.language.ch) {
                sprite.spriteFrame = this.roundChinese[0];
            }
            else if (i18n.curLang == GLB.language.en) {
                sprite.spriteFrame = this.roundEnglish[0];
            }
        }
        else {
            this.node.getComponent(cc.Animation).play("roundOther").on('finished', this.animationFinished.bind(this));
            if (i18n.curLang == GLB.language.ch) {
                sprite.spriteFrame = this.roundChinese[1];
            }
            else {
                sprite.spriteFrame = this.roundEnglish[1];
            }
        }


    },

    animationFinished() {
        this.node.destroy();
    }
});
