import ProductModel from '../model/product-schema.js'
import StatusEnum from '../../../common/status-enum.js'

const ProductService = {
  create(payload) {
    return new ProductModel(payload).save()
  },
  getOne(query) {
    return ProductModel.findOne({ ...query, status: StatusEnum.ACTIVE })
  },
  getAll(query) {
    return ProductModel.find({ ...query, status: StatusEnum.ACTIVE })
  },
  delete(query) {
    return ProductModel.findOneAndUpdate(
      { ...query },
      { status: StatusEnum.DELETED }
    )
  },
  update(query, payload) {
    return ProductModel.findOneAndUpdate(
      { ...query, status: StatusEnum.ACTIVE },
      payload
    )
  },
}

export default ProductService
