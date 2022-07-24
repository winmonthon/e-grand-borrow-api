import UserIdModel from './user-id-schema.js'
import StatusEnum from '../../common/status-enum.js'

const UserIdService = {
  create(payload) {
    return new UserIdModel(payload).save()
  },
  getOne(query) {
    return UserIdModel.findOne({ ...query, status: StatusEnum.ACTIVE })
  },
  getAll(query) {
    return UserIdModel.find({ ...query, status: StatusEnum.ACTIVE })
  },
  getLastestId() {
    return UserIdModel.find({}).sort({ id: -1 }).limit(1)
  },
}

export default UserIdService
