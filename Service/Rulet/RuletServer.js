const socketIO = require("socket.io");
const GameManage = require('./GameManage')
const os = require('os');
const RuletServer = (server) =>{
    server.listen("7575",() => {
        console.log(`RuletServer is running on port `);
    });
    const io = socketIO(server, {
        cors: {
            origin: "*",  // 허용할 도메인
            methods: ["GET", "POST"],  // 허용할 HTTP 메서드
            credentials: true          // 인증 정보도 전송 허용
        }
    });
    const gameManage = new GameManage(io);
    io.on('connection',(user)=>{
        gameManage.getPlayerManage().joinPlayer(user.handshake.headers.authorization,user).
        then((res)=>{if(!res)
            {user.disconnect(true)}
            else{
                const newUserUUID = gameManage.getPlayerManage().getPlayerUUID(user);
                gameManage.getPlayerManage().getPlayerMoney(newUserUUID)
                .then((res)=>{user.emit("userInfo",{"asset":res})})
                //플레이어의 성공적 접속시
                io.emit("playerList",gameManage.getPlayerManage().getPlayerList());
                //플레이어 배팅
                user.on('betting',(payload)=>{gameManage.playerBetting(user,payload)})
                //플레이어 채팅
                user.on('msg',(payload)=>{gameManage.receiveMsg(user,payload)})
                //플레이어의 disconnect
                user.on('disconnect', () => {
                    gameManage.getPlayerManage().disconnectPlayer(user);
                    io.emit("playerList", gameManage.getPlayerManage().getPlayerList());
                });
            }});
    });
}
module.exports = RuletServer;