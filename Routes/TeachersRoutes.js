import express from 'express'
import { verifyToken } from '../utils/jwt.js'
import { login, register, logout, postAssignment, getStudentsBySchool, getAllAssignmentsOfTeacher, getAllSchools, getAllAssignmentsBySchoolAndGradeAndSubject, getAllNotifications, clearNotification, editDetails, getAssignment } from '../Controllers/TeachersController.js'

const TeacherRouter = express.Router()

// login and Register
TeacherRouter.post('/login', login)
TeacherRouter.post('/register', register)

// get methods

// requires Login and jwt middleware
// TeacherRouter.post('/test', verifyToken, (req, res) => { res.status(200).send(req.body) })
TeacherRouter.post('/editDetails/:id', verifyToken, editDetails)
TeacherRouter.post('/postassignment/:id', verifyToken, postAssignment)
TeacherRouter.post('/getAssignment/:id', verifyToken, getAssignment)
TeacherRouter.post('/getAllassignments', verifyToken, getAllAssignmentsBySchoolAndGradeAndSubject)
TeacherRouter.post('/getAllStudents', verifyToken, getStudentsBySchool)
TeacherRouter.post('/getassignments/:id', verifyToken, getAllAssignmentsOfTeacher)
TeacherRouter.post('/getAllNotifications/:id', verifyToken, getAllNotifications)
TeacherRouter.post('/clearNotification/:id', verifyToken, clearNotification)

// requires logged in
TeacherRouter.post('/getAllSchools', getAllSchools)
TeacherRouter.post('/logout/:id', logout)

export default TeacherRouter
