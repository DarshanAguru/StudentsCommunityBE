import { model, Schema } from 'mongoose'

const AssignmentSubmissions = new Schema({
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
  assignmentId: { type: String, required: true }, // coversation id -- teacher , nonce, msg no 99840461973@0354
  assignmentData: { type: String },
  imageLink: { type: String },
  publishDate: { type: Date },
  deadline: { type: Date },
  school: { type: String },
  grade: { type: String },
  submissions: { type: [AssignmentSubmissions] }
},
{
  timestamps: {
    createdAt: 'created_at'
  }
})

export const Assignments = model('Assignments', AssignmentsSchema)
