const express = require('express')
const app = express()

app.use(express.json())

const userRouter = require('./routes/users')
const noteRouter = require('./routes/notes')

app.use("/", userRouter)
app.use("/", noteRouter)


app.listen(8888)






