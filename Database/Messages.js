import { model, Schema } from 'mongoose'

const ReplyMessages = new Schema({
  senderId: { type: String },
  senderType: { type: String },
  senderName: { type: String },
  message: { type: String },
  imageLink: { type: String }
},
{
  timestamps: {
    createdAt: 'created_at'
  }
})

const MessagesSchema = new Schema({
  messageId: { type: String, required: true, unique: true }, // coversation id -- student , nonce, msg no 9881901973@03744
  messageData: { type: String },
  imageLink: { type: String },
  tags: { type: [String] },
  school: { type: String },
  replies: { type: [ReplyMessages] },
  upvote: { type: Number, default: 0 },
  downvote: { type: Number, deafult: 0 }
},
{
  timestamps: {
    createdAt: 'created_at'
  }
})

export const Messages = model('Messages', MessagesSchema)
