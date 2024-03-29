import express from 'express'
import { verifyToken } from '../utils/jwt.js'
import { login, register, logout, editDetails } from '../Controllers/MentorsController.js'

const MentorRouter = express.Router()

// login and Register
MentorRouter.post('/login', login)
MentorRouter.post('/register', register)

// requires Login and jwt middleware
// MentorRouter.post('/test', verifyToken, (req, res) => { res.status(200).send(req.body) })
MentorRouter.post('/editDetails/:id', verifyToken, editDetails)

// requires logged in
MentorRouter.post('/logout/:id', logout)

export default MentorRouter
