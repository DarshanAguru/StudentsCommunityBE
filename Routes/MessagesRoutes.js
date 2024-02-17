import express from 'express'
import { addMessage, addReply, getAllMessages, getMessageThread, getAllMessagesBySchool } from '../Controllers/MessagesController.js'
import { verifyToken } from '../utils/jwt.js'

const MessagesRouter = express.Router()

// required JWT token
MessagesRouter.post('/getallmessages', verifyToken, getAllMessages)
MessagesRouter.post('/getmessage/:id', verifyToken, getMessageThread)
MessagesRouter.post('/addmessage/:id', verifyToken, addMessage)
MessagesRouter.post('/addreply/:id', verifyToken, addReply)
MessagesRouter.post('/getmessagesbyschool', verifyToken, getAllMessagesBySchool)

export default MessagesRouter
