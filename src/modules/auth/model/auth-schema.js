import mongoose from 'mongoose'
import StatusEnum from '../../../common/status-enum.js'

const AuthSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    updateBy: {
      type: String,
      default: 'system',
    },
    status: {
      type: String,
      enum: Object.values(StatusEnum),
      default: StatusEnum.ACTIVE,
    },
  },
  { timestamps: true, strict: true }
)

const AuthModel = mongoose.model('auth', AuthSchema)
export default AuthModel
