import mongoose from 'mongoose'
import StatusEnum from '../../../common/status-enum.js'

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    userId: {
      type: Number,
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

const adminModel = mongoose.model('admin', AdminSchema)
export default adminModel
