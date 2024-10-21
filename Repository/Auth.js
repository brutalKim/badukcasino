const pool = require('./Mysql');
const { v4 } = require('uuid');
require('dotenv').config();
const saveMember = async (id, pw, nickname, conn) => {
    const saveMemberQuery = "INSERT INTO member (member_uuid, member_id, member_pw,member_money, member_nickname) VALUES (?, ?, ?, ? , ?)";
    const uuid = v4();
    await conn.query(saveMemberQuery, [uuid, id, pw,process.env.INITMONEY, nickname]);
};

const signup = async (id, pw, nickname) => {
    let conn = null;
    const checkQuery = "SELECT member_uuid FROM member WHERE member_id = ?";
    try {
        conn = await pool.getConnection();

        // ID 중복 체크
        const [res] = await conn.query(checkQuery, [id]);
        if (res.length < 1) {
            // ID가 존재하지 않으면 회원 가입
            await saveMember(id, pw, nickname, conn);
            return 201; // Created
        } else {
            return 409; // Conflict
        }
    } catch (error) {
        console.error(error); // 오류 로깅
        return 500; // Internal Server Error
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
};


const login = async (id, pw) => {
    let conn = null;
    const checkQuery = "SELECT member_uuid , member_nickname , member_money FROM member WHERE member_id = ? AND member_pw = ?";
    try{
        conn = await pool.getConnection();
        const [res] = await conn.query(checkQuery,[id,pw]);
    if(res.length==1){
        return res[0];
    }else{
        return 401;
    }
    }catch(err){
        console.log(err);
        return 500;
    }finally{
        if(conn) conn.release();
    }
};
const validateUUID = async(uuid) =>{
    let conn = null;
    const validateQuery = "SELECT member_uuid , member_money WHERE memeber_uuid = ?";
    try{
        conn = await pool.getConnection();
        const [res] = await conn.query(checkQuery,[uuid]);
        if(res.length ==1){
            return res[0];
        }else{
            return false;
        }
    }catch(err){
        console.log(err);
    }finally{
        if(conn) conn.release();
    }
}
module.exports = { signup, login};
