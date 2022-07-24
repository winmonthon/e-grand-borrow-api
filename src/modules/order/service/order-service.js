import OrderModel from '../model/order-schema.js'
import StatusEnum from '../../../common/status-enum.js'

const OrderService = {
  create(payload) {
    return new OrderModel(payload).save()
  },
  getOne(query) {
    return OrderModel.findOne({ ...query, status: StatusEnum.ACTIVE })
  },
  getAll(query) {
    return OrderModel.find({ ...query, status: StatusEnum.ACTIVE })
  },
  delete(query) {
    return OrderModel.findOneAndUpdate(
      { ...query },
      { status: StatusEnum.DELETED }
    )
  },
  update(query, payload) {
    return OrderModel.findOneAndUpdate(
      { ...query, status: StatusEnum.ACTIVE },
      payload
    )
  },
}

export default OrderService
