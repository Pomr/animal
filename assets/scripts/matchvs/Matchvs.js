var engine;
var response = {};
var MsMatchInfo;
var MsCreateRoomInfo;
try {
    engine = Matchvs.MatchvsEngine.getInstance();
    MsMatchInfo = Matchvs.MsMatchInfo;
    MsCreateRoomInfo = Matchvs.MsCreateRoomInfo;
} catch (e) {
    try {
        var jsMatchvs = require("matchvs.all");
        //获取Matchvs引擎对象
        engine = new jsMatchvs.MatchvsEngine();
        //回调对象，进行注册、登录、发送消息等操作之后，会被异步调用   
        response = new jsMatchvs.MatchvsResponse();
        MsMatchInfo = jsMatchvs.MsMatchInfo;
        MsCreateRoomInfo = jsMatchvs.MsCreateRoomInfo;
    } catch (e) {
        var MatchVSEngine = require('MatchvsEngine');
        engine = new MatchVSEngine();
    }
}
module.exports = {
    engine: engine,
    response: response,
    MatchInfo: MsMatchInfo,
    CreateRoomInfo: MsCreateRoomInfo,
};