var GLB = require("Glb")
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        setTimeout(function () {
            if (this && this.node) {
                this.node.destroy();
            }
        }.bind(this), 2000);
    },


    setData(num) {
        var word = "";
        if (i18n.curLang == GLB.language.ch) {   //中文
            switch (num) {
                case 1:
                    word = "网络断开连接"
                    break;
                case 2:
                    word = "对方已退出"
                    break;
                case 3:
                    word = "其他玩家退出游戏"
                    break;
                case 4:
                    word = "等待房主开始游戏"
                    break;
                case 5:
                    word = "房间人数不足"
                    break;
                default:
                    break;
            }
        }
        else if (i18n.curLang == GLB.language.en) {  //英文
            switch (num) {
                case 1:
                    word = "Network disconnection"
                    break;
                case 2:
                    word = "The other party has withdrawn"
                    break;
                case 3:
                    word = "Other players quit the game"
                    break;
                case 4:
                    word = "Waiting for the homeowner to start the game"
                    break;
                case 5:
                    word = "Insufficient number of players in the room"
                    break;
                default:
                    break;
            }
        }
        this.node.getChildByName("word").getComponent(cc.Label).string = word;
    }

});
