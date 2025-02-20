const express = require('express')
const {getAllNotes, getNote, postNote, deleteNote, deleteAllNotes, putNote} = require('./requestHandler')

const router = express.Router()

//GET API
router.get('/notes', getAllNotes)
router.get('/notes/:id', getNote)

//POST API
router.post('/notes', postNote)

//DELETE API
router.delete('/notes', deleteAllNotes)
router.delete('/notes/:id', deleteNote)

//PUT API
router.put('/notes/:id', putNote)



module.exports = router