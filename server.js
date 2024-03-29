import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import * as limiter from 'express-rate-limit'
import StudentRouter from './Routes/StudentsRoutes.js'
import TeacherRouter from './Routes/TeachersRoutes.js'
import MentorRouter from './Routes/MentorsRoutes.js'
import LocalAdminRouter from './Routes/LocalAdminRoutes.js'
import GlobalAdminRouter from './Routes/GlobalAdminRoutes.js'
import MessagesRouter from './Routes/MessagesRoutes.js'
import globalRouter from './Routes/globalRoutes.js'

dotenv.config()

const app = express()
app.use(express.json())

try {
  mongoose.connect(
    process.env.MONGO_URL
  )
  mongoose.set('strictQuery', false)
} catch (e) {
  console.log(e)
}

const rateLimit = limiter.rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
})

app.use(rateLimit)

app.use(cors(
  {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 204
  }
))
// app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 9000

app.use('/students', StudentRouter)
app.use('/teachers', TeacherRouter)
app.use('/mentors', MentorRouter)
app.use('/localadmins', LocalAdminRouter)
app.use('/globaladmins', GlobalAdminRouter)
app.use('/messages', MessagesRouter)
app.use('/global', globalRouter)

app.listen(port, () => {
  // connect to mongodb

  console.log(`Server is running on port: ${port}`)
})
