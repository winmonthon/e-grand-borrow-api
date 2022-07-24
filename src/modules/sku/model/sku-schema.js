import mongoose from 'mongoose'
import StatusEnum from '../../../common/status-enum.js'
import useStatusEnum from '../../../common/use-status-enum.js'

const SkuSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      default: '',
    },
    condition: {
      type: String,
      required: true,
    },
    useStatus: {
      type: String,
      enum: Object.values(useStatusEnum),
      default: useStatusEnum.NO_USE,
    },
    usingBy: {
      type: Object,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(StatusEnum),
      default: StatusEnum.ACTIVE,
    },
  },
  { timestamps: true, strict: true }
)

const skuModel = mongoose.model('sku', SkuSchema)
export default skuModel
