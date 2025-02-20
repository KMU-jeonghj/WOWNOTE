const { getConnection } = require('./db/db')


// GET
// 모든 노트 조회
async function getAllNotes(req, res) {
    //
    let conn
    try {
        conn = await getConnection()
        const notes = await conn.query("SELECT * FROM notes")

        //디비에 노트 없을때
        if (notes.length === 0) {
            res.json({
                message : "작성된 노트가 없습니다."
            })
        } else {
            res.json(notes) //->query 가 알아서 json으로 바꿔줌!
        }

    } catch (err) {
        console.error("getAllNote error: ", err)
        res.status(500).json({message : "500 error"})
    } finally {
        if (conn) conn.release()
    }

}

//특정 노트 조회
async function getNote(req, res) {}


//POST
//노트 추가
async function postNote(req, res) {}


//PUT
//노트 수정
async function putNote(req, res) {}


//DELETE
//특정 노트 삭제
async function deleteNote(req, res) {}

//전체 노트 삭제
async function deleteAllNotes(req, res) {}








module.exports = { getAllNotes, getNote, postNote, putNote, deleteNote, deleteAllNotes }
