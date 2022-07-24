import mongoose from 'mongoose'
import StatusEnum from '../../../common/status-enum.js'

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
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

const productModel = mongoose.model('product', ProductSchema)
export default productModel
