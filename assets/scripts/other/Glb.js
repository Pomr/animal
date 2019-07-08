window.Game={
  gameManager:null,
  // webSocket:null,
}
window.GameState = cc.Enum({
  none: 0,     //lobby界面
  play: 1,     //readygo之后
  over: 2,     //离开房间，游戏结束
})
var obj={
    RANDOM_MATCH:1,     //随机匹配
    PROPERTY_MATCH:2,   //房间匹配
    matchType:1,       //匹配类型选择 上面两个
    isRoomOwner:false,
    channel:'MatchVS',
    platform:'alpha',       //测试模式  例如'alpha ,release'
    // gameId:215673,                                     //matchvs信息
    // appKey:'dddc0bced02a463caed94f6d4be94ed8#C',       //matchvs信息
    // gameVersion:'3fa12721c7d64667b559e4c13fe4a1e2',    //matchvs信息
    IP: "wxrank.matchvs.com",
    PORT: "3010",
    gameId: 215673,
    appKey: 'dddc0bced02a463caed94f6d4be94ed8#C',
    secret: '3fa12721c7d64667b559e4c13fe4a1e2',
    playerInfo:null,        //玩家信息   
    maxPlayer:2,
    playerFlag: {
        blue: 0,
        red: 1,
      },
    winFlag:0,
    otherPlayerInfo:null,
    round: {
        self: 1,
        other: 2,
    },
    autoId:0,
    language:{
      ch:"Chinese",
      en:"English",
    },
    top:[ //段位
      {t0:"0"},
      {t1:"1"},
      {t2:"2"},
      {t3:"3"},
      {t4:"白银"},
      {t5:"青铜"},
    ],
}
module.exports=obj;