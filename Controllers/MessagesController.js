import { Mentors } from '../Database/Mentors.js'
import { Messages } from '../Database/Messages.js'
import { Students } from '../Database/Students.js'
import { Teachers } from '../Database/Teachers.js'

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Messages.find({})
    if (!messages) {
      return res.status(404).send({ message: 'Messages not found' })
    }
    res.status(200).send(messages)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}

export const getMessageThread = async (req, res) => {
  const messageId = req.params.id
  try {
    const message = await Messages.findOne({ messageId })
    if (!message) {
      res.status(404).send({ message: 'Message Not found' })
    }
    res.status(200).send(message)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}

export const addMessage = async (req, res) => {
  const messageId = req.params.id
  const school = req.body.school
  const messageData = req.body.messageData
  const imageLink = (req.body.imageLink) ? req.body.imageLink : undefined
  const tags = (req.body.tags) ? req.body.tags : undefined
  const studentId = req.params.id.split('@')[0]
  try {
    const message = {
      messageId,
      messageData,
      imageLink,
      tags,
      school
    }

    const messageSave = new Messages(message)

    const student = await Students.findOne({ _id: studentId })
    if (!student) {
      return res.status(404).send({ message: 'Not Found' })
    }
    if (!student.messages || student.messages.length === 0) {
      student.messages.push(messageId)
      await student.save()
    } else if (!student.messages.includes(messageId)) {
      student.messages.push(messageId)
      await student.save()
    }

    await messageSave.save()
    res.status(201).send({ message: 'Message Saved' })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}

export const addReply = async (req, res) => {
  const messageId = req.params.id
  const { senderId, senderType, senderName, message } = req.body
  const imageLink = (req.body.imageLink) ? req.body.imageLink : undefined
  try {
    const messageThread = await Messages.findOne({ messageId })
    if (!messageThread) {
      return res.status(404).send({ message: 'Message Not Found' })
    }

    const newReply = {
      senderId,
      senderType,
      senderName,
      message,
      imageLink
    }

    if (senderType === 'Teacher') {
      const teacher = Teachers.findOne({ _id: senderId })
      if (!teacher) {
        return res.status(404).send({ message: 'Not Found' })
      }
      if (!teacher.messages || teacher.messages.length === 0) {
        teacher.messages.push(messageId)
        await teacher.save()
      } else if (!teacher.messages.includes(messageId)) {
        teacher.messages.push(messageId)
        await teacher.save()
      }
    }
    if (senderType === 'Student') {
      const student = Students.findOne({ _id: senderId })
      if (!student) {
        return res.status(404).send({ message: 'Not Found' })
      }
      if (!student.messages || student.messages.length === 0) {
        student.messages.push(messageId)
        await student.save()
      } else if (!student.messages.includes(messageId)) {
        student.messages.push(messageId)
        await student.save()
      }
    }
    if (senderType === 'Mentor') {
      const mentor = Mentors.findOne({ _id: senderId })
      if (!mentor) {
        return res.status(404).send({ message: 'Not Found' })
      }
      if (!mentor.messages || mentor.messages.length === 0) {
        mentor.messages.push(messageId)
        await mentor.save()
      } else if (mentor.messages && !mentor.messages.includes(messageId)) {
        mentor.messages.push(messageId)
        await mentor.save()
      }
    }

    messageThread.replies.push(newReply)
    await messageThread.save()
    res.status(201).send({ message: 'Reply added' })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}

export const getAllMessagesBySchool = async (req, res) => {
  const schoolName = req.body.school
  try {
    const schoolMessages = await Messages.find({ school: schoolName })
    if (!schoolMessages) {
      return res.status(404).send({ message: 'Not Found' })
    }
    res.status(200).send(schoolMessages)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}
