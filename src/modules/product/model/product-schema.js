import mongoose from 'mongoose'
import StatusEnum from '../../../common/status-enum.js'
import ProductTypeEnum from '../../../common/product-type-enum.js'

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
    category: {
      type: String,
      enum: Object.values(ProductTypeEnum),
      default: ProductTypeEnum.PRODUCT,
    },
    image: {
      type: String,
      default: '',
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
