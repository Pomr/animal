var mvs=require("Matchvs");
function MatchvsEngine() { }
/**
 * 初始化
 * @param channel 渠道 例如matchvs
 * @param platform 平台 例如'alpha,release'
 * @param gameID 游戏ID
 * @param {string} appKey
 */
MatchvsEngine.prototype.init = function (channel, platform, gameID, appKey) {
    var result=mvs.engine.init(mvs.response,channel,platform,gameID,appKey,1);
    console.log("初始化result"+result);
    return result;
}
/**
 * 注册
 * @return {number|*}
 */
MatchvsEngine.prototype.registerUser = function () {
    var result=mvs.engine.registerUser();
    console.log("注册result"+result);
    return result;
}
/**
 * 注册
 * @param userID
 * @param token
 * @returns {DataView|*|number|void}
 */
MatchvsEngine.prototype.login=function(userID,token){
    var DeviceID='matchvs';
    var result=mvs.engine.login(userID,token,DeviceID);
    console.log("登录result"+result);
    return result;
}
module.exports = MatchvsEngine;







// function MatchvsEngine() {
//     console.log('MatchvsEngine init');
// }

// MatchvsEngine.prototype.init = function(matchVSResponses, channel, platform, gameid){
//     this.responses = matchVSResponses;
//     return 0;
// };

// MatchvsEngine.prototype.registerUser = function() {
//     this._forEachResponse(function(res) {
//         setTimeout(function(){
//             var userInfo = {
//                 userID: 10086,
//                 token: 'jkfldjalfkdjaljfs',
//                 name: '张三',
//                 avatar: 'http://d3819ii77zvwic.cloudfront.net/wp-content/uploads/2015/02/child-fist-pump.jpg'
//             };
//             res.registerUserResponse && res.registerUserResponse(userInfo);
//         }, 100);
//     });
//     return 0;
// };

// MatchvsEngine.prototype.login = function(userID,token,gameid,gameVersion,appkey, secret,deviceID,gatewayid){
//     return 0;
// };

// MatchvsEngine.prototype.joinRandomRoom = function(){
//     this._forEachResponse(function(res) {
//         setTimeout(function(){
//             var roomInfo = {
//                 status: 0,
//                 userInfoList: [
//                     {userID: 10086,userProfile: '张三'},
//                     {userID: 10087,userProfile: '李四'},
//                     {userID: 10088,userProfile: '王五'},
//                 ],
//                 roomInfo: {
//                     rootID: 1028374,
//                     rootProperty: "好房间",
//                     owner: 10086,
//                 }
//             };
//             res && res.roomJoinResponse(roomInfo);
//         }, 100);
//     });
//     return 0;
// };

// MatchvsEngine.prototype._forEachResponse = function(func) {
//     if (this.responses) {
//         for(var i = 0; i<this.responses.length; i++) {
//             this.responses[i] && func(this.responses[i]);
//         }
//     }
// };

// MatchvsEngine.prototype.joinOver = function(){
//     return 0;
// };

// MatchvsEngine.prototype.sendEvent = function(event){
//     var mockEventId = new Date().getTime();
//     this._forEachResponse(function(res){
//         setTimeout(function(){
//             res.sendEventRsp && res.sendEventRsp({"status": 0, "seq": mockEventId});
//         }, 100);
//     });
//     return {status: 0, seq: mockEventId};
// };
// module.exports = MatchvsEngine;
