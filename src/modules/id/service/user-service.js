import UserModel from '../model/user-schema.js'
import StatusEnum from '../../../common/status-enum.js'

const UserService = {
  create(payload) {
    return new UserModel(payload).save()
  },
  getOne(query) {
    return UserModel.findOne({ ...query, status: StatusEnum.ACTIVE })
  },
  getAll(query) {
    return UserModel.find({ ...query, status: StatusEnum.ACTIVE })
  },
  delete(query) {
    return UserModel.findOneAndUpdate(
      { ...query },
      { status: StatusEnum.DELETED }
    )
  },
  update(query, payload) {
    return UserModel.findOneAndUpdate({ ...query }, payload)
  },
}

export default UserService
