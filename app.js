const express = require('express')
const app = express()
const port = 8888

app.use(express.json())

const router = require('./route')
app.use('/', router);  


app.listen(8888)

let dbMap = new Map()
let idCounter = 1




