let ante = 0;
class BettingManage{
    #ante = 0;
    #socket;
    #value1=new Set();
    #value3=new Set();
    #value5=new Set();
    #value10=new Set();
    #value20=new Set();
    constructor(socket){
        this.#socket = socket;
    }
    bet(uuid,payload){
        let amount = 0;
        if(payload.value1 !== 0){
            this.#value1.add({"uuid":uuid,"amount":payload.value1});
            this.#ante += payload.value1;
            amount += payload.value1;
        }
        
        if(payload.value3 !== 0){
            this.#value3.add({"uuid":uuid,"amount":payload.value3});
            this.#ante += payload.value3;
            amount += payload.value3;
        }
        
        if(payload.value5 !== 0){
            this.#value5.add({"uuid":uuid,"amount":payload.value5});
            this.#ante += payload.value5;
            amount += payload.value5;
        }
        
        if(payload.value10 !== 0){
            this.#value10.add({"uuid":uuid,"amount":payload.value10});
            this.#ante += payload.value10;
            amount += payload.value10;
        }
        
        if(payload.value20 !== 0){
            this.#value20.add({"uuid":uuid,"amount":payload.value20});
            this.#ante += payload.value20;
            amount += payload.value20;
        }
        this.#socket.emit("ante",this.#ante);
        return amount;
    }
    getBettingList(resultNum){
        switch (resultNum) {
            case 1:
                return this.#value1;
            case 3:
                return this.#value3;
            case 5:
                return this.#value5;
            case 10:
                return this.#value10;
            case 20:
                return this.#value20;
            default:
                return;
        }
    }
    clearBettingList(){
        this.#value1.clear();
        this.#value3.clear();
        this.#value5.clear();
        this.#value10.clear();
        this.#value20.clear();
    }
}
module.exports = BettingManage;