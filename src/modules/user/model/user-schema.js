import mongoose from 'mongoose'
import StatusEnum from '../../../common/status-enum.js'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      default: '',
    },
    userId: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: 'member',
    },
    status: {
      type: String,
      enum: Object.values(StatusEnum),
      default: StatusEnum.ACTIVE,
    },
  },
  { timestamps: true, strict: true }
)

const userModel = mongoose.model('user', UserSchema)
export default userModel
