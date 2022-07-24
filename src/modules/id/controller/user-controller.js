import UserService from '../service/user-service.js'
import UserIdLogic from '../../../plugin/user-id/user-id-logic.js'
import dotenv from 'dotenv'
import AuthController from '../../auth/controller/auth-controller.js'
import UserHistoryService from '../../user-history/service/user-history-service.js'
import UserTypeEnum from '../../../common/user-type-enum.js'
import RequestService from '../../request/service/request-service.js'
dotenv.config()

const UserController = {
  async create(req, res) {
    const { username, password } = req.body

    const isHaveUser = await UserService.getOne({ username })

    if (isHaveUser) {
      return res.status(401).json({
        success: false,
        msg: 'ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้วกรุณาลองใหม่',
      })
    }

    const { id } = await UserIdLogic.createUserId()

    const created = await UserService.create({
      ...req.body,
      userId: id,
    })

    await AuthController.createAuth(username, id, password)

    res.status(200).json({
      success: true,
      data: created,
    })
  },
  async getOneUser(req, res) {
    try {
      const { userId } = req.params
      const user = await UserService.getOne({ userId })
      const userRequestHistory = await RequestService.getAll({ userId }).sort({createdAt: 'desc'})
      

      const data = { ...user._doc, history : userRequestHistory }

      res.status(200).json({
        success: true,
        data,
      })
    } catch (error) {
      console.error(error)
      res.status(400).json({
        success: false,
      })
    }
  },
  async getAllUser(req, res) {
    const { page = 1, size = 10, q } = req.query

    const calSkip = (page, size) => {
      return (page - 1) * size
    }
    const calPage = (count, size) => {
      return Math.ceil(count / size)
    }

    const results = await UserService.getAll({
      $or: [
        { tel: { $regex: q } },
        { username: { $regex: q } },
        { email: { $regex: q } },
        { firstName: { $regex: q } },
        { lastName: { $regex: q } },
      ],
    })
      .sort({ createdAt: 'desc' })
      .skip(calSkip(page, size))
      .limit(parseInt(size))
      .exec()

    const count = await UserService.getAll({
      $or: [
        { tel: { $regex: q } },
        { username: { $regex: q } },
        { email: { $regex: q } },
        { firstName: { $regex: q } },
        { lastName: { $regex: q } },
      ],
    })
      .sort({ createdAt: 'desc' })
      .countDocuments()
      .exec()

    res.status(200).json({
      success: true,
      currentPage: page,
      allPages: calPage(count, size),
      currentCount: results.length,
      totalCount: count,
      data: results,
    })
  },
  async updateUser(req, res) {
    const { userId } = req.params

    const updated = await UserService.update({ userId }, { ...req.body })

    res.status(200).json({
      success: true,
      updated,
    })
  },
  async deleteUser(req, res) {
    try {
      const { userId } = req.params

      const deleted = await UserService.delete({ userId })

      res.status(200).json({
        success: true,
        deleted,
      })
    } catch (error) {
      console.log(error)
      res.status(400).json({
        succes: false,
        msg: 'บางอย่างผิดพลาด กรุณาลองใหม่',
      })
    }
  },
  async getUserByToken(req, res) {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]

      const user = await AuthController.decode(token)

      const userId = user.userId
      const userInfo = await UserService.getOne({ userId })
      const userHistory = await UserHistoryService.getAll({ userId })

      const data = { ...userInfo._doc, userHistory }
      console.log(data)
      res.status(200).json({
        success: true,
        data,
      })
    } catch (error) {
      console.error(error)
      res.status(400).json({
        success: false,
      })
    }
  },
  async updateByUser(req, res) {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]
      const user = await AuthController.decode(token)
      const userId = user.userId
      const updated = await UserService.update({ userId }, { ...req.body })

      res.status(200).json({
        success: true,
        updated,
      })
    } catch (error) {
      console.log(error)
      res.status(400).json({
        succes: false,
        msg: 'บางอย่างผิดพลาด กรุณาลองใหม่',
      })
    }
  },
}

export default UserController
