import { model, Schema } from 'mongoose'

const GlobalAdminsSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  emailId: { type: String, reuqired: true },
  age: { type: Number },
  gender: { type: String },
  password: { type: String, required: true }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

export const GlobalAdmins = model('GlobalAdmins', GlobalAdminsSchema)
