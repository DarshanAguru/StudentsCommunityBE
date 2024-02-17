import { Mentors } from '../Database/Mentors.js'
import { VerificationTag } from '../Database/VerificationTag.js'
import jwt from 'jsonwebtoken'
import { hashPassword, verifyPass } from '../utils/passwordVerifyAndHash.js'

export const login = async (req, res) => {
  const { phoneNumber, password } = req.body // taking post parameters from request
  try {
    const mentor = await Mentors.findOne({ phoneNumber }) // getting the teacher details
    // if not found
    if (!mentor) {
      return res.status(404).send({ message: 'Not Found' })
    }

    if (mentor.verificationStatus === 'pending') {
      return res.status(401).send({ message: 'Pending' }) // Not authorized
    }

    if (mentor.verificationStatus === 'rejected') {
      return res.status(401).send({ message: 'Rejected' }) // Not authorized
    }

    // if incorrect credentials
    if (!verifyPass(password, mentor.password)) {
      return res.status(401).send({ message: 'Not authorized' })
    }

    const expTimeCookies = 60 * 60 * 24 * 1000 // expiration time in milliseconds (1 day)
    const expTime = 60 * 60 * 24 // expiration time in seconds (1 day)

    // jwt token generation
    const token = jwt.sign({ userType: 'Mentors', userId: mentor._id }, process.env.JWT_SECRET_KEY, {
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

    const tag = await VerificationTag.findOneAndUpdate({ userId: mentor._id }, {
      userType: 'Mentors',
      token
    }
    ,
    { upsert: true, new: true }
    )

    if (!tag) {
      console.log('Error')
      return res.status(500).send({ message: 'Internal Server Error' }) // Server Error .. Retry login
    }

    const dataToSend = { ...mentor._doc, password: undefined, messages: undefined, created_at: undefined, updated_at: undefined, __V: undefined }
    res.status(200).send(dataToSend) // retuning teacher details
  } catch (err) {
    console.log(err)
    res.status(401).send({ message: 'Not authorized' }) // Not authorized
  }
}

export const register = async (req, res) => {
  const { phoneNumber, name, emailId, password, age, gender, description, subjectExpertise, qualification, resumeLink, institution } = req.body
  // console.log(req.body);
  const hashedPassword = await hashPassword(password)

  try {
    const newMentor = new Mentors({
      phoneNumber,
      name,
      emailId,
      age,
      gender,
      password: hashedPassword,
      description,
      subjectExpertise,
      resumeLink,
      qualification,
      institution
    })

    await newMentor.save()
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
