import SkuModel from '../model/sku-schema.js'
import StatusEnum from '../../../common/status-enum.js'

const SkuService = {
  create(payload) {
    return new SkuModel(payload).save()
  },
  getOne(query) {
    return SkuModel.findOne({ ...query, status: StatusEnum.ACTIVE })
  },
  getAll(query) {
    return SkuModel.find({ ...query, status: StatusEnum.ACTIVE })
  },
  delete(query) {
    return SkuModel.findOneAndUpdate(
      { ...query },
      { status: StatusEnum.DELETED }
    )
  },
  update(query, payload) {
    return SkuModel.findOneAndUpdate(
      { ...query, status: StatusEnum.ACTIVE },
      payload
    )
  },
}

export default SkuService
