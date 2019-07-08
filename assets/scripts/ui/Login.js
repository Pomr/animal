var _i18n=require("LanguageData");
var GLB=require("Glb")
cc.Class({
    extends: cc.Component,

    properties: {
        sprite:cc.Node,
        
    },

    onLoad() {
        // cc.find("Canvas/Login/btn_start").on('touchend', this.btn_start, this);    
        //on不行 添加到button事件可以
        uiManager.addButtonEvent(this.node,"Login","btn_Chinese","Canvas/Login/choose_language/Chinese");
        uiManager.addButtonEvent(this.node,"Login","btn_English","Canvas/Login/choose_language/English");
        uiManager.addButtonEvent(this.node,"Login","btn_language","Canvas/Login/language");
        uiManager.addButtonEvent(this.node,"Login","btn_start","Canvas/Login/btn_start");
    },

    btn_start() {       //多人对战联网
        Game.gameManager.matchvsInit();
    },
    btn_Chinese() {
        _i18n.init(GLB.language.ch)
        _i18n.updateSceneRenderers();
        this.sprite.width=250;
    },
    btn_English() {
        _i18n.init(GLB.language.en)
        _i18n.updateSceneRenderers();
        this.sprite.width=350;
    },
    btn_language() {
        // this.node.getChildByName("choose_language").active = !this.node.getChildByName("choose_language").active;
        if (i18n.curLang == GLB.language.ch) {
            _i18n.init(GLB.language.en);
            _i18n.updateSceneRenderers();
        }
        else {
            _i18n.init(GLB.language.ch);
            _i18n.updateSceneRenderers();
            this.sprite.width=350;
        }
    },
    // update (dt) {},
});
