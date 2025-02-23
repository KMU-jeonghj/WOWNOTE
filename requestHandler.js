const { getConnection } = require('./db/db')


// GET
// 모든 노트 조회 (GET /notes)
async function getAllNotes(req, res) {
    //
    let conn
    try {
        conn = await getConnection()
        const notes = await conn.query("SELECT * FROM notes")

        //디비에 노트 없을때
        if (notes.length === 0) {
            return res.status(404).json({
                message : "작성된 노트가 없습니다."
            })
        } 
            
        return res.status(200).json(notes) //->query 가 알아서 json으로 바꿔줌!
        

    } 
    catch (err) {
        console.error("getAllNote error: ", err)
        return res.status(500).json({message : "500 error"})
    } 
    finally {
        if (conn) conn.release()
    }

}

//특정 노트 조회 (GET /notes/:id)
async function getNote(req, res) {
    let conn
    try {
        conn = await getConnection()
        const {id} = req.params
        //인젝션 방지위해 비인딩 매개변수로 파라미터 전달
        const note = await conn.query("SELECT * FROM notes WHERE id = ?", [id])

        if (note.length === 0) {
            return res.status(404).json({ 
                message : "노트를 찾을 수 없습니다."
            })
        }

        return res.status(200).json(note[0])

    } 
    catch (err) {
        console.error("getNote error: ", err)
        return res.status(500).json({
            message : "500 ERROR"
        })
    } 
    finally {
        if (conn) conn.release()
    }
}



/** JSON 필드 값이 누락되었는지 확인하는 함수 */
function checkFields(fields, keys) {
    // 값이 누락된 필드를 배열에 저장
    const miss = keys.filter(key => !fields[key])

    if (miss.length > 0) {
        return {
            isValid: false,
            message : `${miss.join(", ")} 값을 입력해주세요.`
            // join(", ") -> , 기준으로 배열이나 객체 요소를 반환한다. 
        }
    }

    return {isValid : true}
}

/** 유효한 user_id인지 검증하는 함수 */
async function isValidUser(conn, user_id) {
    try {
        const userQuery = "SELECT * FROM users WHERE id = ?";
        const user = await conn.query(userQuery, [user_id]);

        return user.length > 0; //  유저가 존재하면 true, 없으면 false 반환

    } catch (err) {
        console.error("isValidUser error:", err);
        return false; // 오류 발생 시 false 반환
    }
}

/** 노트 존재 여부 확인 함수  */
async function isValidNote(conn, note_id) {
    try {
        const query = "SELECT * FROM notes WHERE id = ?";
        const note = await conn.query(query, [note_id]);

        return note.length > 0; //  노트가 존재하면 true, 없으면 false 반환

    } catch (err) {
        console.error("isValidNote error:", err);
        return false; // 오류 발생 시 false 반환
    }
}


//POST
//노트 추가 (POST /notes)
async function postNote(req, res) {
    let conn
    try {
        conn = await getConnection()
        const { user_id, title, content } = req.body
        const fields = {user_id, title, content}


        //user_id 유효성 검증
        const isUserValid = await isValidUser(conn, user_id)
        if (!isUserValid) {
            return res.status(400).json({
                message : `${user_id} 는 유효하지 않은 user_id 입니다.`
            })
        }     

        //body 값 누락 여부 확인
        const validation = checkFields(fields, ["user_id", "title", "content"])

        if (!validation.isValid) {
            return res.status(400).json({
                message : validation.message
            })
        }

        // 노트 생성 쿼리
        await conn.query(
            "INSERT INTO notes (users_id, title, content) VALUES (?, ?, ?)",
            [user_id, title, content]
        )
        
        return res.status(201).json({
            message : `"${title}" 노트가 작성되었습니다.`
        })


    } catch (err) {
        console.error("postNote error:", err);
        return res.status(500).json({ message: "500 ERROR" });

    } finally {
        if (conn) conn.release()
    }
}


//PUT
//노트 수정 (PUT /notes/:id)
async function putNote(req, res) {
    let conn
    try {
        conn = await getConnection()
        const { id } = req.params
        const { user_id, title, content } = req.body

        //필드 비었는지 확인
        const validation = checkFields({user_id, title, content}, ["user_id", "title", "content"])
        if (!validation.isValid) {
            return res.status(400).json({
                message : validation.message
            })
        }

        //user_id 있는지 확인
        const isUserValid = await isValidUser(conn, user_id)
        if (!isUserValid) {
            return res.status(400).json({
                message : `${user_id} 는 유효하지 않은 user_id 입니다.`
            })
        }

        //note 있는지 확인
        const noteExists = await isValidNote(conn, id)
        if (!noteExists) {
            return res.status(404).json({
                message : `${id} 번 노트를 찾을 수 없습니다.`
            })
        }


        //노트 수정 쿼리
        await conn.query(
            "UPDATE notes SET title = ?, content = ? WHERE id = ?",
            [title, content, id]
        )

        return res.status(200).json({message : "노트가 수정되었습니다."})



    } catch (err) {
        console.error("putNote error:", err);
        return res.status(500).json({ message: "500 ERROR" });

    } finally {
        if (conn) conn.release()
    }
}


//DELETE
//특정 노트 삭제 (DELETE /notes/:id)
async function deleteNote(req, res) {
    let conn
    try {
        conn = await getConnection()
        const {id} = req.params

        //노트 있는지 확인
        const noteExists = await isValidNote(conn, id)
        if (!noteExists) {
            return res.status(404).json({
                message : "노트를 찾을 수 없습니다."
            })
        }


        // 노트 삭제 쿼리
        await conn.query("DELETE FROM notes WHERE id = ?", [id])

        return res.status(200).json({
            message : "노트가 삭제되었습니다."
        })

    } 
    catch (err) {
        console.error("deleteNote error:", err);
        return res.status(500).json({ message: "500 ERROR" });

    } 
    finally {

        if (conn) conn.release()
    }
}

//회원별 전체 노트 삭제 (DELETE /users/:user_id)
async function deleteAllNotes(req, res) {
    let conn
    try {
        conn = await getConnection()
        const {user_id} = req.params

        //user_id 검증
        const isUserValid = await isValidUser(conn, user_id)
        if (!isUserValid) {
            return res.status(400).json({
                message : `${user_id} 는 유효하지 않은 user_id 입니다`
            })
        }

        //회원별 note 존재 여부 확인
        const notes = await conn.query("SELECT * FROM notes WHERE users_id = ?", [user_id])
        if (notes.length === 0) {
            return res.status(404).json({
                message : `${user_id} 번 유저의 노트가 없습니다.`
            })
        }

        //전체 노트 삭제
        await conn.query("DELETE FROM notes WHERE users_id = ?", [user_id])

        return res.status(200).json({
            message : `${user_id} 번 유저의 모든 노트가 삭제되었습니다.`
        })

    } 
    catch (err) {
        console.error("deleteAllNotes error:", err);
        return res.status(500).json({ message: "500 ERROR" });
    } 
    finally {
        if (conn) conn.release()
    }
}




module.exports = { getAllNotes, getNote, postNote, putNote, deleteNote, deleteAllNotes }
