import { model, Schema } from 'mongoose'

const AssigmentSubmissions = new Schema({
  senderId: { type: String },
  senderName: { type: String },
  message: { type: String },
  imageLink: { type: String }
},
{
  timestamps: {
    createdAt: 'created_at'
  }
})

const AssignmentsSchema = new Schema({
  assigmentId: { type: String, required: true }, // coversation id -- teacher , nonce, msg no 99840461973@0354
  assigmentData: { type: String },
  imageLink: { type: String },
  publishDate: { type: Date },
  deadline: { type: Date },
  school: { type: String },
  grade: { type: String },
  submissions: { type: [AssigmentSubmissions] }
},
{
  timestamps: {
    createdAt: 'created_at'
  }
})

export const Assignments = model('Assignments', AssignmentsSchema)
