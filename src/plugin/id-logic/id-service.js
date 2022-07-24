import IdModel from './id-schema.js'
import StatusEnum from '../../common/status-enum.js'

const IdService = {
  create(payload) {
    return new IdModel(payload).save()
  },
  getOne(query) {
    return IdModel.findOne({ ...query, status: StatusEnum.ACTIVE })
  },
  getAll(query) {
    return IdModel.find({ ...query, status: StatusEnum.ACTIVE })
  },
  getLastestId() {
    return IdModel.find({}).sort({ id: -1 }).limit(1)
  },
  async getIdAndUpdate(key) {
    const result = await IdModel.findOneAndUpdate(
      { key },
      { $inc: { counter: 1 } },
      { new: true, upsert: true }
    )

    return result.counter
  },
}

export default IdService
