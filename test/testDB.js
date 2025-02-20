const { getConnection } = require('../db/db');

async function testDB() {
    let conn

    try {
        conn = await getConnection()
        console.log("DB 연결됨")
        
        // 1️ INSERT 테스트 (새로운 유저 추가)
        const insertQuery = "INSERT INTO users (name) VALUES (?)";
        const insertResult = await conn.query(insertQuery, ['테스트유저']);
        console.log(" INSERT 성공! 추가된 ID:", insertResult.insertId);

        // 2️ SELECT 테스트 (현재 users 테이블 데이터 확인)
        const selectQuery = "SELECT * FROM users";
        const users = await conn.query(selectQuery);
        console.log(" 현재 users 테이블 데이터:", users);

        // 3️ DELETE 테스트 (방금 추가한 사용자 삭제)
        const deleteQuery = "DELETE FROM users WHERE id = ?";
        await conn.query(deleteQuery, [insertResult.insertId]);
        console.log(" DELETE 성공! ID:", insertResult.insertId);

        // 4️ 삭제 후 다시 SELECT 실행 (데이터 삭제 확인)
        const usersAfterDelete = await conn.query(selectQuery);
        console.log(" DELETE 후 users 테이블 데이터:", usersAfterDelete);


    } catch (err) {
        console.log("db 연결 실패: ", err)
    
    } finally {
        if (conn) conn.release()
    }
}

testDB()