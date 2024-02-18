import express from 'express'
import { verifyToken } from '../utils/jwt.js'
import { login, register, logout, verifyTeacher, getTeachersBySchool } from '../Controllers/LocalAdminController.js'

const LocalAdminRouter = express.Router()

// login and Register
LocalAdminRouter.post('/login', login)
LocalAdminRouter.post('/register', register)

// requires Login and jwt middleware
LocalAdminRouter.post('/test', verifyToken, (req, res) => { res.status(200).send(req.body) })
LocalAdminRouter.post('/verifyTeacher/:id', verifyToken, verifyTeacher)
LocalAdminRouter.post('/getTeachers', verifyToken, getTeachersBySchool)

// requires logged in
LocalAdminRouter.post('/logout/:id', logout)

export default LocalAdminRouter
