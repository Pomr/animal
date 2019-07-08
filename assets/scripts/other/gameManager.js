var mvs = require("Matchvs");
var GLB = require("Glb")
// var _i18n = require("LanguageData");
var Net = require("../http");
cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.SpriteFrame,
    },

    onLoad() {
        // this.languageInit()
        cc.game.addPersistRootNode(this.node);
        Game.gameManager = this;
        this.gameState;
        this.auto = false;
        this.matchvsInit();
    },
    // languageInit() {
    //     if (i18n.curLang) {
    //         _i18n.init(i18n.curLang);
    //         _i18n.updateSceneRenderers();
    //     }
    //     else {
    //         _i18n.init(GLB.language.ch);
    //         _i18n.updateSceneRenderers();
    //     }
    // },
    showAuto() {
        return this.auto;
    },
    setAutoFalse() {
        this.auto = false;
    },
    setAutoTrue() {
        this.auto = true;
    },
    blockInputEvents() {
        this.node.getComponent(cc.BlockInputEvents).enable = true;
        this.scheduleOnce(function () {
            this.node.getComponent(cc.BlockInputEvents).enable = false;
        }, 5)
    },

    matchvsInit() {
        mvs.response.initResponse = this.initResponse.bind(this);
        mvs.response.registerUserResponse = this.registerUserResponse.bind(this);
        mvs.response.loginResponse = this.loginResponse.bind(this); // 用户登录之后的回调
        mvs.response.createRoomResponse = this.createRoomResponse.bind(this);
        mvs.response.joinRoomResponse = this.joinRoomResponse.bind(this);
        mvs.response.joinRoomNotify = this.joinRoomNotify.bind(this);
        mvs.response.errorResponse = this.errorResponse.bind(this);
        mvs.response.leaveRoomResponse = this.leaveRoomResponse.bind(this);
        mvs.response.leaveRoomNotify = this.leaveRoomNotify.bind(this);
        mvs.response.joinOverResponse = this.joinOverResponse.bind(this);
        mvs.response.getRoomListResponse = this.getRoomListResponse.bind(this);
        mvs.response.kickPlayerResponse = this.kickPlayerResponse.bind(this);
        mvs.response.kickPlayerNotify = this.kickPlayerNotify.bind(this);
        mvs.response.sendEventResponse = this.sendEventResponse.bind(this);
        mvs.response.logoutResponse = this.logoutResponse.bind(this);
        mvs.response.sendEventNotify = this.sendEventNotify.bind(this);
        mvs.response.networkStateNotify = this.networkStateNotify.bind(this);
        var result = mvs.engine.init(mvs.response, GLB.channel, GLB.platform, GLB.gameId,  //初始化
            GLB.appKey, GLB.gameVersion);
        if (result !== 0) {
            console.log('初始化失败,错误码:' + result);
        }
    },
    initResponse: function () {
        console.log('初始化成功，开始注册用户');
        var result = mvs.engine.registerUser();    //注册
        if (result !== 0) {
            console.log('注册用户失败，错误码:' + result);
        } else {
            console.log('注册用户成功');
        }
    },

    registerUserResponse: function (userInfo) {
        var deviceId = 'abcdef';
        GLB.playerInfo = userInfo;
        console.log('开始登录,用户Id:' + userInfo.id)
        var result = mvs.engine.login(userInfo.id, userInfo.token, deviceId);  //登录
        if (result !== 0) {
            console.log('登录失败,错误码:' + result);
        }
        //####传送玩家信息到排行榜####
        var reqData={"uid":userInfo.userID.toString()}
        Net.send(Constant.NEWUSER,reqData,function(response){
            if(response){
                console.log(response)
            }
        })
    },

    loginResponse: function (info) {
        if (info.status !== 200) {    //登录失败
            console.log("登陆失败");
        }
        else {
            console.log("登陆成功");
            this.gameState = GameState.none;
            cc.find("Canvas/Lobby").getComponent("Lobby").initUser();
        }
    },
    createRoomResponse(res) {
        if (res.status !== 200) {
            if (res.status == -4) {
                cc.game.removePersistRootNode(this.node);
                cc.director.loadScene('main');
                cc.find("Canvas/Lobby").getComponent("Lobby").initUser();
            }
            console.log("创建房间失败，失败信息：" + rsp);
            return;
        }
        cc.find("Canvas/CreateRoom").getComponent("CreateRoom").createRoomResponse(res.owner);
    },
    joinRoomResponse(status, roomUserInfoList, roomInfo) {
        if (status == 200) {
            console.log("加入房间成功");
            if (GLB.matchType == GLB.RANDOM_MATCH) {
                cc.find("Canvas/Lobby").getComponent("Lobby").randomMatching(roomUserInfoList, roomInfo);
            }
            else if (GLB.matchType == GLB.PROPERTY_MATCH) {
                uiManager.openUI("Room", function (obj) {
                    obj.getComponent("Room").joinRoom(roomUserInfoList, roomInfo)
                });
            }
        }
        else if (status == -4) {
            console.log("未登录");
            cc.game.removePersistRootNode(this.node);
            cc.director.loadScene('main');
        }
        else {
            console.log("加入房间失败：" + status);
        }
    },
    joinOverResponse(res) {
        if (res.status == 200) {
            console.log("房间人数已满，关闭房间");   //进入游戏
            if (this.showAuto() == false) {
                if (GLB.matchType == GLB.RANDOM_MATCH) {
                    if (GLB.isRoomOwner) {
                        if (cc.find("Canvas/Matching").getComponent("Matching").autoCheck) {
                            this.setAutoTrue();
                        }
                        cc.director.loadScene("game")
                    }
                }
            }
        }
        else {
            console.log("错误信息：" + res.status);
        }
    },
    joinRoomNotify(roomUserInfo) {
        if (GLB.matchType == GLB.RANDOM_MATCH) {
            cc.find("Canvas/Matching").getComponent("Matching").joinOtherPlayer(roomUserInfo);
        }
        else if (GLB.matchType == GLB.PROPERTY_MATCH) {
            cc.find("Canvas/Room").getComponent("Room").joinOtherPlayer(roomUserInfo);
        }
    },
    leaveRoomResponse(res) {     //从房间离开，从匹配中离开
        if (res.status == 200) {
            console.log("成功离开房间");
        }
        else {
            console.log("错误信息：" + res.status)
        }
    },
    getRoomListResponse: function (status, roomInfos) {
        if (status !== 200) {
            console.log("失败 status:" + status);
            return;
        }
        var data = {
            status: status,
            roomInfos: roomInfos
        }
        cc.find("Canvas/JoinRoom").getComponent("JoinRoom").getRoomListResponse(data);
    },
    kickPlayerResponse: function (res) {
        if (res.status == 200) {
            console.log("踢人成功");
            cc.find("Canvas/Room").getComponent("Room").kickPlayerResponse(res);
        }
        else {
            console.log("踢人失败：" + res.status);
        }
    },
    kickPlayerNotify: function (res) {
        cc.find("Canvas/Room").getComponent("Room").kickPlayerNotify(res);
    },
    leaveRoomNotify(res) {
        if (res.cpProto == "Room") {
            cc.find("Canvas/Room").getComponent("Room").leaveRoomNotify(res);
        }
        else if (res.cpProto == "ExitGame") {
            cc.find("Canvas/GameVer").getComponent("GameVer").leaveRoomNotify(res);
        }
    },
    logoutResponse(res) {
        if (res == 200) {
            cc.game.removePersistRootNode(this.node);
            cc.director.loadScene('main');
        }
        else {
            console.log("退出错误：" + res.status)
        }
    },
    errorResponse: function (error, msg) {
        if (error === 1001 || error === 0 || error === -4) {
            uiManager.openUI("Tip", function (obj) {
                var uiTip = obj.getComponent("Tip");
                obj.getComponent("Tip").setData(1);
                if (uiTip) {
                    uiTip.setData(1);
                }
            });
            setTimeout(function () {
                if (cc.find("Canvas/GameVer")) {
                    cc.find("Canvas/GameVer").getComponent("GameVer").clearTime();
                }
                mvs.engine.logout("");
                cc.game.removePersistRootNode(this.node);
                cc.director.loadScene('main');
            }.bind(this), 2500);
        }
        console.log("错误信息：" + error);
        console.log("错误信息：" + msg);
    },
    networkStateNotify(res) {
        if (res.userID !== GLB.playerInfo.userID && Game.gameManager.gameState === GameState.play) {  //正在游戏界面
            uiManager.openUI("Tip", function (obj) {
                var uiTip = obj.getComponent("Tip");
                if (uiTip) {
                    uiTip.setData(2);
                }
                if (GLB.isRoomOwner) {
                    GLB.winFlag = GLB.playerFlag.blue;
                }
                else {
                    GLB.winFlag = GLB.playerFlag.red;
                }
                uiManager.openUI("Result", function (obj) {
                    obj.getComponent("Result").setScore(GLB.winFlag);
                    cc.find("Canvas/GameVer").getComponent("GameVer").clearTime();
                })
            });
        } else {   //不在游戏中时 在房间中
            if (cc.find("Canvas/Room")) {
                cc.find("Canvas/Room").getComponent("Room").leaveRoomNotify(res);
            }
        }
    },
    sendEventResponse(res) {
        if (res.status == 200) {
            console.log("事件发送成功")
        }
    },
    sendEvent(type, data1, data2, data3) {
        if (type == "open") {
            var msg = {
                action: type,
                num: data1,
            }
        }
        else if (type == "eat") {
            var msg = {
                action: type,
                oldSign: data1,
                newSign: data2,
                eatType: data3,
            }
        }
        else if (type == "moveToKong") {
            var msg = {
                action: type,
                chessSign: data1,
                kongSign: data2,
            }
        }
        else if (type == "start") {
            var msg = {
                action: type,
                arr: data1,
            }
        }
        else if (type == "readygo") {
            var msg = {
                action: type,
            }
            cc.find("Canvas/GameVer").getComponent("GameVer").initreadyGo();
        }
        mvs.engine.sendEvent(JSON.stringify(msg));
    },
    sendEventNotify(eventInfo) {  //srcUserID、cpProto
        var str = eventInfo.cpProto;
        var arr = str.split(',');
        var action
        if (arr.length > 1) {
            action = arr[0].substr(11, arr[0].length - 12);   //指令
        }
        else if (arr.length == 1) {
            action = arr[0].substr(11, arr[0].length - 13);   //指令
        }
        if (action == "start") {
            var list = [];
            var arr1 = arr[1].split(":");
            if (arr1[0].substr(1, arr1[0].length - 2) == "arr") {   //start时的arr
                for (var i = 1; i < arr.length; i++) {
                    var num;
                    if (i == 1) {
                        num = arr1[1].substr(1, arr1.length)
                        list.push(parseInt(num));
                    }
                    else if (i == arr.length - 1) {
                        num = arr[i].substr(0, arr[i].length - 2)
                        list.push(parseInt(num));
                    }
                    else {
                        list.push(parseInt(arr[i]))
                    }
                }
            }
            cc.director.loadScene("game", function () {
                cc.find("Canvas/GameVer/game").getComponent("game").initGame(list);
            });
        }
        else if (action == "readygo") {
            cc.find("Canvas/GameVer").getComponent("GameVer").initreadyGo();
        }
        else if (action == "open") {
            var num = parseInt(arr[1].split(":")[1])
            cc.find("Canvas/GameVer/game").getComponent("game").otherOpenChess(num);
        }
        else if (action == "eat") {
            var oldSign = parseInt(arr[1].split(":")[1]);
            var newSign = parseInt(arr[2].split(":")[1]);
            var eatType = arr[3].split(":")[1].substr(1, arr[3].split(":")[1].length - 3);
            cc.find("Canvas/GameVer/game").getComponent("game").otherPlayerEat(eatType, oldSign, newSign);
        }
        else if (action == "moveToKong") {
            var chessSign = parseInt(arr[1].split(":")[1]);
            var kongSign = parseInt(arr[2].split(":")[1]);
            cc.find("Canvas/GameVer/game").getComponent("game").otherMoveToKong(chessSign, kongSign);
        }
        console.log(str);
    },

});