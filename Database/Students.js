import { model, Schema } from 'mongoose'

const StudentSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  emailId: { type: String },
  grade: { type: String, required: true },
  school: { type: String, required: true },
  age: { type: String },
  gender: { type: String },
  password: { type: String, required: true },
  assigments: { type: [String] },
  messages: { type: [String] }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

export const Students = model('Students', StudentSchema)
