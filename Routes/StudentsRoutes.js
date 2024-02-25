import express from 'express'
import { verifyToken } from '../utils/jwt.js'
import { login, register, logout, submitAssigment, getAllMessagesOfStudent, getAllSchools, getAllassignmentsBySchoolAndGradeAndSubject, clearNotification, getAllNotifications } from '../Controllers/StudentController.js'

const StudentRouter = express.Router()

// login and Register
StudentRouter.post('/login', login)
StudentRouter.post('/register', register)

// requires Login and jwt middleware
// StudentRouter.post('/test', verifyToken, (req, res) => { res.status(200).send(req.body) })
StudentRouter.post('/submitassignment/:id', verifyToken, submitAssigment)
StudentRouter.post('/getallassignments', verifyToken, getAllassignmentsBySchoolAndGradeAndSubject)
StudentRouter.post('/getmessages/:id', verifyToken, getAllMessagesOfStudent)
StudentRouter.post('/getAllNotifications/:id', verifyToken, getAllNotifications)
StudentRouter.post('/clearNotification/:id', verifyToken, clearNotification)

// requires logged in
StudentRouter.post('/getAllSchools', getAllSchools)
StudentRouter.post('/logout/:id', logout)

export default StudentRouter
