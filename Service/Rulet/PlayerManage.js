const HashMap = require('hashmap');
const { getUser , setUserMoney ,getUserMoney} = require('../../Repository/User');
const { jwtVerify } = require('../../MiddleWare/JWTtoken');
class PlayerManage {
    #userMap;
    #uuidMap;
    constructor() {
        // 프라이빗 필드 초기화
        this.#userMap = new HashMap();
        this.#uuidMap = new HashMap();
    }

    // 플레이어 추가 메서드
    async joinPlayer(token, userSocket) {
        try {
            // JWT 토큰 검증
            const authentication = await jwtVerify(token);

            // 사용자 정보 가져오기
            const userInfo = await getUser(authentication.uuid);

            // 사용자 정보가 없으면 false 반환
            if (userInfo === 500) {
                return false;
            }

            // 사용자 소켓과 정보를 맵에 추가
            this.#addPlayer(userSocket, authentication.uuid, userInfo);
            return true;
        } catch (err) {
            console.log(err);
            return false; // 오류 발생 시 false 반환
        }
    }
    // 프라이빗 메서드: 사용자 추가
    #addPlayer(userSocket, uuid, userInfo) {
        this.#userMap.set(userSocket, {
            uuid: uuid,
            nickname: userInfo.nickname,
            money: userInfo.money,
        });
        this.#uuidMap.set(uuid,userSocket);
    }

    // 플레이어 연결 해제 메서드
    disconnectPlayer(userSocket) {
        const uuid = this.getPlayerUUID(userSocket);
        this.#uuidMap.delete(uuid);
        this.#userMap.delete(userSocket);
    }

    // 플레이어 목록 반환 메서드
    getPlayerList() {
        let players = [];

        // 프라이빗 필드인 #userMap에 접근할 때 this.#userMap 사용
        this.#userMap.forEach((value, key) => {
            players.push({ nickname: value.nickname, money: value.money });
        });

        return players;
    }
    getPlayerUUID(user){
        return this.#userMap.get(user).uuid;
    }
    getPlayerSocket(uuid){
        return this.#uuidMap.get(uuid);
    }
    //플레이어 money update메서드
    async setPlayerMoney (uuid,amount){
        const asset = await setUserMoney(uuid,amount);
        return asset;
    }
    async getPlayerMoney (uuid){
        return getUserMoney(uuid);
    }
}

module.exports = PlayerManage;
