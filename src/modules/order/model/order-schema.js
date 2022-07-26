import mongoose from 'mongoose'
import StatusEnum from '../../../common/status-enum.js'
import orderStatusEnum from '../../../common/order-status-enum.js'

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    productList: {
      type: Array,
      required: true,
    },
    productConfirmed: {
      type: Array,
      default: [],
    },
    orderStatus: {
      type: String,
      enum: Object.values(orderStatusEnum),
      default: StatusEnum.PENDING,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    userNote: {
      type: String,
      default: '',
    },
    adminNote: {
      type: String,
      default: '',
    },
    createdBy: {
      type: Object,
      required: true,
    },
    updatedBy: {
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

const orderModel = mongoose.model('order', OrderSchema)
export default orderModel
