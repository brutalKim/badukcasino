const pool = require('./Mysql');

const getUser = async(uuid)=>{
    let conn = null;
    const userInfoQuery = "SELECT member_nickname , member_money FROM member WHERE member_uuid = ?";
    try {
        conn = await pool.getConnection();
        const [res] = await conn.query(userInfoQuery,[uuid]);
        return { nickname : res[0].member_nickname , money : res[0].member_money };
    } catch (err) {
        return 500;
    }finally{
        if(conn) conn.release();
    }
};
const setUserMoney = async(uuid,amount)=>{
    console.log(amount);
    let conn = null;
    const userInfoQuery = "UPDATE member SET member_money = member_money + ? WHERE member_uuid = ?";
    const getUserAssetQuery = "SELECT member_money FROM member WHERE member_uuid = ?";
    try {
        conn = await pool.getConnection();
        await conn.query(userInfoQuery,[amount,uuid]);
        const [res] = await conn.query(getUserAssetQuery,[uuid]);
        return res[0].member_money;
    } catch (err) {
        console.log(err);
        return 500;
    }finally{
        if(conn) conn.release();
    }
}
const getUserMoney = async(uuid) =>{
    let conn = null;
    const getUserMoneyQuery = "SELECT member_money FROM member WHERE member_uuid = ?";
    try{
        conn = await pool.getConnection();
        const [money] = await conn.query(getUserMoneyQuery,[uuid]);

        return money[0].member_money;
    }catch(err){
        console.log(err);
        return 500;
    }finally{
        if(conn) conn.release();
    }
}


module.exports = { getUser , setUserMoney,getUserMoney};