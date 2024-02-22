import express from 'express'
import { addMessage, addReply, getAllMessages, getMessageThread, getAllMessagesBySchool, upvote, downvote } from '../Controllers/MessagesController.js'
import { verifyToken } from '../utils/jwt.js'

const MessagesRouter = express.Router()

// required JWT token
MessagesRouter.post('/getallmessages', verifyToken, getAllMessages)
MessagesRouter.post('/getmessage/:id', verifyToken, getMessageThread)
MessagesRouter.post('/addmessage/:id', verifyToken, addMessage)
MessagesRouter.post('/addreply/:id', verifyToken, addReply)
MessagesRouter.post('/getmessagesbyschool', verifyToken, getAllMessagesBySchool)
MessagesRouter.post('/upvote/:id', verifyToken, upvote)
MessagesRouter.post('/downvote/:id', verifyToken, downvote)

export default MessagesRouter
