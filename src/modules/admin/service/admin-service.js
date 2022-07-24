import AdminModel from '../model/admin-schema.js'
import StatusEnum from '../../../common/status-enum.js'

const AdminService = {
  create(payload) {
    return new AdminModel(payload).save()
  },
  getOne(query) {
    return AdminModel.findOne({ ...query, status: StatusEnum.ACTIVE })
  },
  getAll(query) {
    return AdminModel.find({ ...query, status: StatusEnum.ACTIVE })
  },
  delete(query) {
    return AdminModel.findOneAndUpdate(
      { ...query },
      { status: StatusEnum.DELETED }
    )
  },
  update(query, payload) {
    return AdminModel.findOneAndUpdate({ ...query }, payload)
  },
}

export default AdminService
