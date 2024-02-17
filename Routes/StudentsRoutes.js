import express from 'express'
import { verifyToken } from '../utils/jwt.js'
import { login, register, logout, submitAssigment, getAllassignmentsBySchoolAndGrade } from '../Controllers/StudentController.js'

const StudentRouter = express.Router()

// login and Register
StudentRouter.post('/login', login)
StudentRouter.post('/register', register)

// requires Login and jwt middleware
StudentRouter.post('/test', verifyToken, (req, res) => { res.status(200).send(req.body) })
StudentRouter.post('/submitassignment/:id', verifyToken, submitAssigment)
StudentRouter.post('/getallassignments', verifyToken, getAllassignmentsBySchoolAndGrade)

// requires logged in
StudentRouter.post('/logout/:id', logout)

export default StudentRouter
