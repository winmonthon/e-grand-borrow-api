import mongoose from 'mongoose'
import StatusEnum from '../../common/status-enum.js'

const UserIdSchema = new mongoose.Schema(
  {
    id: {
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

const UserIdModel = mongoose.model('userid', UserIdSchema)
export default UserIdModel
