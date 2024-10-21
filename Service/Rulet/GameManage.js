const PlayerManage = require('./PlayerManage');
const BettingManage = require('./BettingManage');
class GameManage {
    #ready = true;
    #count = 30;
    #socket = null;
    #number = [1, 3, 1, 10, 1, 3, 1, 5, 1, 5, 3, 1, 10, 1, 3, 1, 5, 1, 3, 1, 20, 1, 3, 1, 5];
    #PlayerManage;
    #BettingManage;
    constructor(socket) {
        if (this.#socket === null) this.#socket = socket;
        this.#countDown();
        this.#PlayerManage = new PlayerManage();
        this.#BettingManage = new BettingManage(socket);
    }

    // 카운트다운 메서드
    #countDown = (playerStatus) => {
        if(playerStatus !== undefined){
            playerStatus[0].forEach((uuid)=>{
                this.#PlayerManage.getPlayerMoney(uuid)
                .then((asset)=>{
                    this.#PlayerManage.getPlayerSocket(uuid).emit("accounting",{"won":true,"asset":asset});
                })
            })
            playerStatus[1].forEach((uuid)=>{
                this.#PlayerManage.getPlayerMoney(uuid)
                .then((asset)=>{
                    this.#PlayerManage.getPlayerSocket(uuid).emit("accounting",{"won":false,"asset":asset})
                })
            })
        }
        
        this.#ready = true;
        const startTime = Date.now();
        this.#socket.emit("startNewPhase");
        const tick = () => {
            const elapsed = Date.now() - startTime; // 경과 시간 계산
            const currentCount = this.#count - Math.floor(elapsed / 1000); // 실제 경과된 초만큼 count 감소

            if (currentCount >= 0) {
                // 소켓을 통해 상태 전송
                this.#socket.emit("gamestatus", { "ready": this.#ready, "count": currentCount });
                setTimeout(tick, 1000 - (elapsed % 1000)); // 다음 tick을 조정
            } else {
                // 카운트다운이 끝났을 때 스핀 시작
                this.#startSpin();
            }
        };

        tick();
    }
    #startNextPhase(){
        this
    }

    // 스핀 시작 메서드
    #startSpin = () => {
        const randomIndex = Math.floor(Math.random() * this.#number.length);
        this.#ready = false;
        
        // 스핀 시작 상태와 목표값 전송
        this.#socket.emit("gamestatus", { "ready": this.#ready });
        this.#socket.emit("startspin", { "target": this.#number[randomIndex] });
        
        // 8초 후 다시 카운트다운 시작
        this.#accounting(this.#number[randomIndex])
        .then((playerStatus)=>{
            setTimeout(()=>{
                this.#BettingManage.clearBettingList();
                this.#countDown(playerStatus);
            }, 8000);
        })
    }
    getPlayerManage(){
        return this.#PlayerManage;
    }
    playerBetting(user,payload){
        const uuid = this.#PlayerManage.getPlayerUUID(user);
        const amount = this.#BettingManage.bet(uuid,payload);
        this.#PlayerManage.setPlayerMoney(uuid,-amount)
        .then((asset)=>{user.emit("betting",{"asset":asset})});
    }
    //정산
    async #accounting(resultNum) {
        const number = [1, 3, 5, 10, 20];
        let winnerPlayerList = new Set();
        let loserPlayerList = new Set();
        const winnerList = this.#BettingManage.getBettingList(resultNum);
            // 비동기 작업을 순차적으로 처리
            for (const value of winnerList) {
                await this.#deposit(value.uuid, resultNum, value.amount);
                winnerPlayerList.add(value.uuid);  // 승자 리스트에 추가
            }
        for (const num of number) {
    
            if (resultNum !== num) {
                const bettingList = this.#BettingManage.getBettingList(num);
                
                for (const value of bettingList) {
                    if (!winnerPlayerList.has(value.uuid)) {
                        loserPlayerList.add(value.uuid);  // 패자 리스트에 추가
                    }
                }
            }
        }
    
        return [winnerPlayerList, loserPlayerList];
    }
    
    async #deposit (uuid,magnification,amount){
        const asset = await this.#PlayerManage.setPlayerMoney(uuid,(magnification+1)*amount);
        return {"price":magnification*amount,"asset":asset}
    }
}

module.exports = GameManage;
