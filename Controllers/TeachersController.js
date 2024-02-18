import { Teachers } from '../Database/Teachers.js'
import { VerificationTag } from '../Database/VerificationTag.js'
import jwt from 'jsonwebtoken'
import { hashPassword, verifyPass } from '../utils/passwordVerifyAndHash.js'
import { Assignments } from '../Database/Assignments.js'
import { Students } from '../Database/Students.js'

export const login = async (req, res) => {
  const { phoneNumber, password } = req.body // taking post parameters from request
  try {
    const teacher = await Teachers.findOne({ phoneNumber }) // getting the teacher details
    // if not found
    if (!teacher) {
      return res.status(404).send({ message: 'Not Found' })
    }

    if (teacher.verificationStatus === 'pending') {
      return res.status(401).send({ message: 'Pending' }) // Not authorized
    }

    if (teacher.verificationStatus === 'rejected') {
      return res.status(401).send({ message: 'Rejected' }) // Not authorized
    }

    // if incorrect credentials
    if (!verifyPass(password, teacher.password)) {
      return res.status(401).send({ message: 'Not authorized' })
    }

    const expTimeCookies = 60 * 60 * 24 * 1000 // expiration time in milliseconds (1 day)
    const expTime = 60 * 60 * 24 // expiration time in seconds (1 day)

    // jwt token generation
    const token = jwt.sign({ userType: 'Teachers', userId: teacher._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: expTime,
      algorithm: 'HS256'
    })

    // jwt token storage
    res.cookie('token', token, {
      maxAge: expTimeCookies,
      // httpOnly: true,
      // secure: true,
      sameSite: 'none'
    })

    const tag = await VerificationTag.findOneAndUpdate({ userId: teacher._id }, {
      userType: 'Teachers',
      token
    }
    ,
    { upsert: true, new: true }
    )

    if (!tag) {
      console.log('Error')
      return res.status(500).send({ message: 'Internal Server Error' }) // Server Error .. Retry login
    }

    const dataToSend = { ...teacher._doc, password: undefined, messages: undefined, assignments: undefined, created_at: undefined, updated_at: undefined, __v: undefined }
    res.status(200).send(dataToSend) // retuning teacher details
  } catch (err) {
    console.log(err)
    res.status(401).send({ message: 'Not authorized' }) // Not authorized
  }
}

export const register = async (req, res) => {
  const { phoneNumber, name, emailId, institution, password, age, gender, description, subjectExpertise } = req.body
  // console.log(req.body);
  const hashedPassword = await hashPassword(password)

  try {
    const newTeacher = new Teachers({
      phoneNumber,
      name,
      emailId,
      age,
      gender,
      institution,
      password: hashedPassword,
      description,
      subjectExpertise
    })

    await newTeacher.save()
    res.status(201).send({ message: 'Registered' })
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Internal Server Error' }) // Internal Server Error
  }
}

export const logout = async (req, res) => {
  const id = req.params.id

  try {
    if (!req.cookies.token) {
      return res.status(404).send({ message: 'Not Found' })
    }
    const token = req.cookies.token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ['HS256'] })
    if (decoded.userId !== id) {
      return res.status(404).send({ message: 'Not Found' })
    }
    const data = await VerificationTag.findOneAndDelete({ userId: id }) // removing token from the verificationTag DB
    if (!data) {
      return res.status(404).send({ message: 'Not Found' })
    }
    res.clearCookie('token')
    res.status(200).send({ message: 'Logged out Successfully!' })
  } catch (err) {
    console.log(err)
    res.status(500).send({ meaasge: 'Internal Server Error' }) // Internal Server Error
  }
}

export const postAssigment = async (req, res) => {
  const assignmentId = req.params.id
  const { assignmentData, publishDate, school, grade, deadline } = req.body
  const imageLink = (req.body.imageLink) ? req.body.imageLink : undefined
  const teacherId = req.params.id.split('@')[0]
  try {
    const assignment = {
      assignmentId,
      assignmentData,
      publishDate,
      deadline,
      imageLink,
      grade,
      school
    }

    const assignmentSave = new Assignments(assignment)
    const teacher = await Teachers.findOne({ _id: teacherId })
    if (!teacher) {
      return res.status(404).send({ message: 'Not Found' })
    }
    if (!teacher.assignments || teacher.assignments.length === 0) {
      teacher.assignments.push(assignmentId)
      await teacher.save()
    } else if (!teacher.assignments.includes(assignmentId)) {
      teacher.assignments.push(assignmentId)
      await teacher.save()
    }

    await assignmentSave.save()
    res.status(201).send({ message: 'Assignment Saved' })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}

export const getAllassignmentsBySchoolAndGrade = async (req, res) => {
  const school = req.body.school
  const grade = req.body.grade
  try {
    const assignments = await Assignments.find({ school, grade })
    if (!assignments) {
      return res.status(404).send({ message: 'Not Found' })
    }
    res.status(200).send(assignments)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}

export const getStudentsBySchool = async (req, res) => {
  const school = req.body.school
  try {
    const students = await Students.find({ school })
    if (!students) {
      return res.status(404).send({ message: 'Not Found' })
    }
    res.status(200).send(students)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}
