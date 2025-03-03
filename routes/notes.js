const express = require('express')
const router = express.Router()
const conn = require('../db/db')
const {body, param, validationResult} = require('express-validator')

router.use(express.json())


const validate = (req, res, next) => {
    const err = validationResult(req)

        if (err.isEmpty()) {
            return next();
        } 
        else {
            //예외처리
            console.log(err.array())
            return res.status(400).json(err.array())
        }
}


router
    .route('/notes')
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('id는 숫자를 입력해야 합니다.'),
            validate
        ],
        (req, res, next) => {

            let {userId} = req.body

            let sql = "SELECT * FROM notes WHERE user_id = ?"

            conn.query(sql, userId,
                function(err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    }
                    else {
                        return res.status(400).end()
                    }
                 
                }
            )

        }
    )
    .post(
        [
            body('userId').notEmpty().isInt().withMessage('id는 숫자를 입력해야 합니다.'),
            body('title').notEmpty().isString().withMessage("제목에 문자를 입력해주세요"),
            body('content').isString().withMessage("내용 오류"),
            validate
        ],
        (req, res, next) => {

            const {title, content, userId} = req.body

            let sql = "INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)"
            let values = [title, content, userId]

            conn.query(sql, values,
                function(err, results) {
                    if(err) {
                        console.log(err)
                        return res.status(400).end()
                    }
                    
                    res.status(201).json(results)
                }
            )
        }
    )



router
    .route('/notes/:id')
    .get(
        [

        ],
        (req, res, next) => {

            let {id} = req.params
            id = parseInt(id)

            let sql = "SELECT * FROM notes WHERE id = ?"
            conn.query(sql, id,
                function(err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length)
                        res.status(200).json(results)
                    else
                        res.status(404).json({
                        message : "NOT FOUND"
                        })


                }
            )
        }
    )
    .put(
        [
            param('id').notEmpty().withMessage('id 필요'),
            body('title').notEmpty().isString().withMessage("제목에 문자를 입력해주세요"),
            body('content').isString().withMessage("내용 오류"),
            validate
        ],
        (req, res, next) => {

            let {id} = req.params
            id = parseInt(id)
            let {title, content} = req.body

            sql = "UPDATE notes SET title = ?, content = ? WHERE id =?"
            let values = [title, content, id]

            conn.query(sql, values,
                function(err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    //update 안됐을 때
                    if (results.affectedRows == 0) {
                        return res.status(400).end()
                    } else {
                        res.status(200).json(results)
                    }

                }
            )
        }
    )
    .delete(
        [
            param('id').notEmpty().withMessage('id 필요'),
            validate
        ],
        (req, res, next) => {

            let {id} = req.params
            id = parseInt(id)

            let sql = "DELETE FROM notes WHERE id = ?"

            conn.query(sql, id,
                function(err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.affectedRows == 0) {
                        return res.status(400).end()
                    } 
                    else {
                        res.status(200).json(results)
                    }


                }
            )
        }
    )










module.exports = router