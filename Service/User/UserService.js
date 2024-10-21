const {getUser} = require('../../Repository/User');

const getUserService = async (uuid)=>{
    return await getUser(uuid);
}