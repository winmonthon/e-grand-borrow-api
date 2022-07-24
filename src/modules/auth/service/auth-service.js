import AuthModel from "../model/auth-schema.js"
import StatusEnum from "../../../common/status-enum.js"

const AuthService = {
  createAuth(payload) {
    return new AuthModel(payload).save()
  },
  getOneAuth(query) {
    return AuthModel.findOne({ ...query, status: StatusEnum.ACTIVE })
  },
  getAllAuth(query) {
    return AuthModel.find({ ...query, status: StatusEnum.ACTIVE })
  },
  deleteAuth(query) {
    return AuthModel.findOneAndUpdate(
      { ...query },
      { status: StatusEnum.DELETED }
    )
  },
  updateAuth(query, payload) {
    return AuthModel.findOneAndUpdate({ ...query }, payload)
  },
}

export default AuthService
