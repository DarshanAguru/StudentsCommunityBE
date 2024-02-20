import { Mentors } from '../Database/Mentors.js'
import { Students } from '../Database/Students.js'
import { Teachers } from '../Database/Teachers.js'
import { LocalAdmins } from '../Database/LocalAdmin.js'
// import { SMSApi, SmsMessage, SmsMessageCollection } from 'clicksend/api.js'
import jwt from 'jsonwebtoken'
import { hashPassword } from '../utils/passwordVerifyAndHash.js'
import { ForgotPassword } from '../Database/ForgotPassword.js'
import { generate } from 'otp-generator'
import api from 'clicksend/api.js'

export const forgotPassword = async (req, res) => {
  const query = req.body.query
  const phoneNo = req.body.phoneNo
  const type = req.body.type
  try {
    let data
    if (query === 'generateOTP') {
      if (type === 'mentors') {
        data = await Mentors.findOne({ phoneNumber: phoneNo })
      } else if (type === 'students') {
        data = await Students.findOne({ phoneNumber: phoneNo })
      } else if (type === 'teachers') {
        data = await Teachers.findOne({ phoneNumber: phoneNo })
      } else if (type === 'localadmins') {
        data = await LocalAdmins.findOne({ phoneNumber: phoneNo })
      } else {
        data = null
      }

      if (!data || (data === null)) {
        return res.status(404).send({ message: 'Data Not Found' })
      }

      const otp = generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })

      const smsMsg = new api.SmsMessage()
      smsMsg.from = 'EDU RESOLVE'
      smsMsg.to = `+91${data.phoneNumber}`
      smsMsg.body = `Your OTP for the EDU RESOLVE account reset password is ${otp}. It is valid for 3 minutes, please don't share`

      const smsApi = new api.SMSApi(process.env.API_USER_SMS, process.env.API_KEY_SMS)

      const smsCollection = new api.SmsMessageCollection()
      smsCollection.messages = [smsMsg]

      const request = await smsApi.smsSendPost(smsCollection)

      // console.log(request)

      if (!request || (request.body.http_code !== 200)) {
        return res.status(500).send({ message: 'Internal Server Error' })
      }

      const passwordDb = new ForgotPassword({
        userId: data._id,
        phoneNumber: data.phoneNumber,
        type,
        otp
      })

      await passwordDb.save()

      return res.status(200).send({ message: 'OTP sent' })
    } else if (query === 'verifyOTP') {
      const otp = req.body.otp
      const passData = await ForgotPassword.findOne({ phoneNumber: phoneNo })
      if (!passData) {
        return res.status(404).send({ message: 'Not Found' })
      }
      if (otp !== passData.otp) {
        return res.status(401).send({ message: 'Invalid OTP' })
      }
      await ForgotPassword.deleteOne({ _id: passData._id })
      const token = await jwt.sign({ phoneNumber: phoneNo, type }, process.env.JWT_SECRET_KEY_RP)
      return res.status(200).send({ message: 'verified OTP', token })
    } else if (query === 'resetPassword') {
      const password = req.body.password
      const token = req.body.token
      if (!token) {
        return res.status(403).send({ message: 'Forbidden' })
      }
      const verifyToken = await jwt.verify(token, process.env.JWT_SECRET_KEY_RP)
      if (verifyToken.phoneNumber !== phoneNo) {
        return res.status(403).send({ message: 'Forbidden' })
      }

      const hashedPassword = await hashPassword(password)

      if (type === 'mentors') {
        data = await Mentors.findOneAndUpdate({ phoneNumber: phoneNo }, { password: hashedPassword })
      } else if (type === 'students') {
        data = await Students.findOneAndUpdate({ phoneNumber: phoneNo }, { password: hashedPassword })
      } else if (type === 'teachers') {
        data = await Teachers.findOneAndUpdate({ phoneNumber: phoneNo }, { password: hashedPassword })
      } else if (type === 'localadmins') {
        data = await LocalAdmins.findOneAndUpdate({ phoneNumber: phoneNo }, { password: hashedPassword })
      } else {
        data = null
      }

      if (!data || data === null) {
        return res.status(404).send({ message: 'Data Not Found' })
      }

      res.status(200).send({ message: 'password updated' })
    } else if (query === 'sendAgain') {
      const otp = generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })

      const smsMsg = new api.SmsMessage()
      smsMsg.from = 'EDU RESOLVE'
      smsMsg.to = `+91${phoneNo}`
      smsMsg.body = `Your OTP for the EDU RESOLVE account reset password is ${otp}. It is valid for 3 minutes, please don't share`

      const smsApi = new api.SMSApi(process.env.API_USER_SMS, process.env.API_KEY_SMS)

      const smsCollection = new api.SmsMessageCollection()
      smsCollection.messages = [smsMsg]

      const request = await smsApi.smsSendPost(smsCollection)

      // console.log(request)

      if (!request) {
        return res.status(500).send({ message: 'Internal Server Error' })
      }

      const dataPass = await ForgotPassword.findOneAndUpdate({ phoneNumber: phoneNo }, { otp }, { upsert: true, new: true })
      if (!dataPass) {
        return res.status(404).send({ message: 'Data Not Found' })
      }

      res.status(200).send({ message: 'otp sent' })
    } else {
      return res.status(500).send({ message: 'Internal Server Error' })
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}
