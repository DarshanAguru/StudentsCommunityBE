import express from 'express'
import { verifyToken } from '../utils/jwt.js'
import { login, register, logout, verifyLocalAdmin, verifyMentor, getAllMentors, getAllLocalAdmins } from '../Controllers/GlobalAdminController.js'

const GlobalAdminRouter = express.Router()

// login and register
GlobalAdminRouter.post('/login', login)
GlobalAdminRouter.post('/register', register)

// requires Login and jwt middleware
GlobalAdminRouter.post('/test', verifyToken, (req, res) => { res.status(200).send(req.body) })
GlobalAdminRouter.post('/verifyMentor/:id', verifyToken, verifyMentor)
GlobalAdminRouter.post('/verifyLocalAdmin/:id', verifyToken, verifyLocalAdmin)
GlobalAdminRouter.post('/getAllMentors', verifyToken, getAllMentors)
GlobalAdminRouter.post('/getAllLocalAdmins', verifyToken, getAllLocalAdmins)

// requires logged in
GlobalAdminRouter.post('/logout/:id', logout)

export default GlobalAdminRouter
