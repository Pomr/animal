var GLB = require("Glb")
window.uiManager = {
    // uiList:[]
};
uiManager.openUI = function (uiName, callback) {
    cc.loader.loadRes('ui/' + uiName, function (err, prefab) {
        if (err) {
            cc.error(err || err.message);
            return;
        }
        var node = cc.instantiate(prefab);
        node.parent = cc.find("Canvas");
        if (callback) {
            callback(node);
        }
        // cc.director.getScene().children[0].addChild(node)
        // cc.find("Canvas").addChild(node);
        // uiManager.uiList.push(node);
    })
}


uiManager.setIcon = function (avatar, node) {
    var icon = new cc.SpriteFrame(avatar)
    node.getComponent(cc.Sprite).spriteFrame = icon;
}

uiManager.addButtonEvent = function (target, component, handler, path) {
    var clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = target;
    clickEventHandler.component = component;
    clickEventHandler.handler = handler;
    var button = cc.find(path).getComponent(cc.Button);
    button.clickEvents.push(clickEventHandler);
},
uiManager.music = function (name) {
    var url = cc.url.raw("resources/audio/" + name + ".mp3");
    cc.audioEngine.play(url, false, 1);
}

// uiManager.findUI=function(uiName){
//     for(var i=i<uiManager.uiList.length-1;i>=0;i--){
//         var node=uiManager.uiList[i];
//         if(node && node.name==uiName){
//             return node;
//         }
//     }
// }