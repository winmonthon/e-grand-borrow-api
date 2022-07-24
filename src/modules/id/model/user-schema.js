import mongoose from 'mongoose'
import StatusEnum from '../../../common/status-enum.js'
import UserTypeEnum from '../../../common/user-type-enum.js'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      default: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    lineUid: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: Object,
      required: true,
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
