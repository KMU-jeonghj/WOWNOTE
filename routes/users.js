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



//login
router.post(
    '/login',
    [
        body('email').notEmpty().isEmail().withMessage("이메일 형식이 잘못되었습니다."),
        body('password').notEmpty().isString().withMessage("비밀번호가 잘못되었습니다."),
        validate
    ],
    function(req, res, next) {

        const {email, password} = req.body

        let sql = "SELECT * FROM users WHERE email = ?"
        conn.query(sql, email,
            function(err, results, fields) {
                if (err) {
                    console.log(err)
                    return res.status(400).end()
                }

                let loginUser = results[0]
                //email db에 있는지 확인 , 유효성
                if (loginUser && loginUser.password === password) {
                    
                    res.status(200).json({
                        message : `${loginUser.name} 로그인 완료`
                    })
                    
                } else if (loginUser && loginUser.password !== password) {
                    res.status(400).json({
                        message : "password is not correct"
                    })
                } else {
                    res.status(404).json({
                        message : "no user"
                    })
                }


            }
        )


    }
)






//회원가입
router.post(
    '/join',
    [
        body('name').notEmpty().isString().withMessage("이름 입력 에러"),
        body('email').notEmpty().isEmail().withMessage("이메일 형식이 잘못되었습니다."),
        body('password').notEmpty().isString().withMessage("비밀번호가 잘못되었습니다."),
        validate
    ],
    function(req, res, next) {


        const {name, email, password} = req.body

        let sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
        let values = [name, email, password]

        conn.query(sql, values,
            function(err, results, fields) {
                //db 에러 잡는 놈
                if (err) { 
                    console.log(err)
                    return res.status(400).end()
                }

                res.status(201).json(results)
            }
        )

    }
)

router
    .route('/users')
    .get(
        [
            body('email').notEmpty().isEmail().withMessage("이메일 형식이 잘못되었습니다."),
            validate
        ],
        function(req, res, next) {

            let {email} = req.body

            let sql = "SELECT * FROM users WHERE email = ?"

            conn.query(sql, email,
                function(err, results, fields) {
                    if (err) { 
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } 
                    else {
                        res.status(404).json({
                            message : "no user"
                        })
                    }
                }
            )

        }
    )
    .delete(
        [
            body('email').notEmpty().isEmail().withMessage("이메일 형식이 잘못되었습니다."),
            validate
        ],
        function(req, res, next) {

            const {email} = req.body

            let sql = "DELETE FROM users WHERE email = ?"

            conn.query(sql, email,
                function(err, results, fields) {
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