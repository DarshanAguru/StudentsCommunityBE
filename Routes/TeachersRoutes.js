import express from 'express'
import { verifyToken } from '../utils/jwt.js'
import { login, register, logout, postAssigment, getAllassignmentsBySchoolAndGrade, getStudentsBySchool, getAllAssignmentsOfTeacher, getAllSchools } from '../Controllers/TeachersController.js'

const TeacherRouter = express.Router()

// login and Register
TeacherRouter.post('/login', login)
TeacherRouter.post('/register', register)

// get methods
TeacherRouter.get('/getAllSchools', getAllSchools)

// requires Login and jwt middleware
// TeacherRouter.post('/test', verifyToken, (req, res) => { res.status(200).send(req.body) })
TeacherRouter.post('/postassignment/:id', verifyToken, postAssigment)
TeacherRouter.post('/getAllassignments', verifyToken, getAllassignmentsBySchoolAndGrade)
TeacherRouter.post('/getAllStudents', verifyToken, getStudentsBySchool)
TeacherRouter.post('/getassignments/:id', verifyToken, getAllAssignmentsOfTeacher)

// requires logged in
TeacherRouter.post('/logout/:id', logout)

export default TeacherRouter
