import { model, Schema } from 'mongoose'

const TeachersSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  emailId: { type: String, reuqired: true },
  subjectExpertise: { type: [String], required: true },
  institution: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  password: { type: String, required: true },
  verificationStatus: { type: String, default: 'Pending' },
  description: { type: String },
  assigments: { type: [String] },
  messages: { type: [String] }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

export const Teachers = model('Teachers', TeachersSchema)
