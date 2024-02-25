import express from 'express'
import { verifyToken } from '../utils/jwt.js'
import { login, register, logout, postAssignment, getStudentsBySchool, getAllAssignmentsOfTeacher, getAllSchools, addPointsToAssignment, getAllAssignmentsBySchoolAndGradeAndSubject, getAllNotifications, clearNotification, editDetails } from '../Controllers/TeachersController.js'

const TeacherRouter = express.Router()

// login and Register
TeacherRouter.post('/login', login)
TeacherRouter.post('/register', register)

// get methods

// requires Login and jwt middleware
// TeacherRouter.post('/test', verifyToken, (req, res) => { res.status(200).send(req.body) })
TeacherRouter.post('/editDetails/:id', verifyToken, editDetails)
TeacherRouter.post('/postassignment/:id', verifyToken, postAssignment)
TeacherRouter.post('/getAllassignments', verifyToken, getAllAssignmentsBySchoolAndGradeAndSubject)
TeacherRouter.post('/getAllStudents', verifyToken, getStudentsBySchool)
TeacherRouter.post('/getassignments/:id', verifyToken, getAllAssignmentsOfTeacher)
TeacherRouter.post('/addPointsToAssignment/:id', verifyToken, addPointsToAssignment)
TeacherRouter.post('/getAllNotifications/:id', verifyToken, getAllNotifications)
TeacherRouter.post('/clearNotification/:id', verifyToken, clearNotification)

// requires logged in
TeacherRouter.post('/getAllSchools', getAllSchools)
TeacherRouter.post('/logout/:id', logout)

export default TeacherRouter
