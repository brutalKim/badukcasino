class ChattingManage{
    #socket;
    constructor(socket){
        this.#socket = socket;
    }
    receiveMsg(user,payload){
        if(this.#socket !==null){
            user.broadcast.emit("msg",{"nickname":payload.nickname,"msg":payload.msg,"sender":false});
            user.emit("msg",{"nickname":payload.nickname,"msg":payload.msg,"sender":true});
        }
    }
}
module.exports = ChattingManage;