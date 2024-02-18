import { Students } from '../Database/Students.js'
import { VerificationTag } from '../Database/VerificationTag.js'
import jwt from 'jsonwebtoken'
import { hashPassword, verifyPass } from '../utils/passwordVerifyAndHash.js'
import { Assignments } from '../Database/Assignments.js'
import { Messages } from '../Database/Messages.js'

export const login = async (req, res) => {
  const { phoneNumber, password } = req.body // taking post parameters from request
  try {
    const student = await Students.findOne({ phoneNumber }) // getting the student details
    // if not found
    if (!student) {
      return res.status(404).send({ message: 'Not Found' })
    }

    // if incorrect credentials
    if (!verifyPass(password, student.password)) {
      return res.status(401).send({ message: 'Not authorized' })
    }

    const expTimeCookies = 60 * 60 * 24 * 1000 // expiration time in milliseconds (1 day)
    const expTime = 60 * 60 * 24 // expiration time in seconds (1 day)

    // jwt token generation
    const token = jwt.sign({ userType: 'Students', userId: student._id }, process.env.JWT_SECRET_KEY, {
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

    const tag = await VerificationTag.findOneAndUpdate({ userId: student._id }, {
      userType: 'Students',
      token
    }
    ,
    { upsert: true, new: true }
    )

    if (!tag) {
      console.log('Error')
      return res.stauts(500).send('Internal server Error') // server error ... Retry login
    }

    const dataToSend = { ...student._doc, password: undefined, messages: undefined, assignments: undefined, created_at: undefined, updated_at: undefined, __v: undefined }
    res.status(200).send(dataToSend) // retuning student details
  } catch (err) {
    console.log(err)
    res.status(401).send({ message: 'Not authorized' }) // Not authorized
  }
}

export const register = async (req, res) => {
  const { phoneNumber, name, emailId, grade, school, age, gender, password } = req.body
  // console.log(req.body);
  const hashedPassword = await hashPassword(password)

  try {
    const newStudent = new Students({
      phoneNumber,
      name,
      emailId,
      grade,
      age,
      gender,
      school,
      password: hashedPassword
    })

    await newStudent.save()
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
    res.status(500).send({ message: 'Internal Server Error' }) // Internal Server Error
  }
}

export const getAllMessagesOfStudent = async (req, res) => {
  const studentId = req.params.id
  try {
    const student = await Students.findOne({ _id: studentId })
    if (!student) {
      return res.status(404).send({ message: 'Student Details not found' })
    }
    const arrMessages = []
    for (let i = 0; i < student.messages.length; i++) {
      if (student.messages[i].split('@')[0] === studentId) {
        const msg = await Messages.findOne({ messageId: student.messages[i] })
        arrMessages.push(msg)
      }
    }
    res.status(200).send(arrMessages)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}

export const submitAssigment = async (req, res) => {
  const assignmentId = req.params.id
  const { senderId, senderName, message } = req.body
  const imageLink = (req.body.imageLink) ? req.body.imageLink : undefined

  try {
    const assignment = await Assignments.findOne({ assignmentId })
    if (!assignment) {
      return res.status(404).send({ message: 'Not Found' })
    }
    const newSubmission = {
      senderId,
      senderName,
      message,
      imageLink
    }

    const student = await Students.findOne({ _id: senderId })
    if (!student) {
      return res.status(404).send({ message: 'Not Found' })
    }

    if (!student.assignments || student.assignments.length === 0) {
      student.assignments.push(assignmentId)
      await student.save()
    } else if (!student.assignments.includes(assignmentId)) {
      student.assignments.push(assignmentId)
      await student.save()
    }
    assignment.submissions.push(newSubmission)
    await assignment.save()
    res.status(201).send({ message: 'Assignment Submitted' })
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
