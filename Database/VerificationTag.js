import { model, Schema } from 'mongoose'

const VerificationTagSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  userType: { type: String, required: true },
  token: { type: String, required: true },
  expireAt: { type: Date, default: Date.now(), expires: 86400000 }
},
{
  timestamps: true
})

export const VerificationTag = model('VerificationTag', VerificationTagSchema)
