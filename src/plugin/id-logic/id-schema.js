import mongoose from 'mongoose'
import StatusEnum from '../../common/status-enum.js'

const IdSchema = new mongoose.Schema(
  {
    counter: {
      type: Number,
      default: 0,
    },
    key: {
      type: String,
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

const IdModel = mongoose.model('id', IdSchema)
export default IdModel
