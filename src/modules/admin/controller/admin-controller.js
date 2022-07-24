import AdminService from '../service/admin-service.js'
import userIdLogic from '../../../plugin/user-id/user-id-logic.js'
import dotenv from 'dotenv'
import AuthController from '../../auth/controller/auth-controller.js'

dotenv.config()

const AdminController = {
  async create(req, res) {
    try {
      const { username, password } = req.body

      const isHaveAdmin = await AdminService.getOne({ username })

      if (isHaveAdmin) {
        return res.status(401).json({
          success: false,
          msg: 'ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้วกรุณาลองใหม่',
        })
      }

      const { id } = await userIdLogic.createUserId()

      await AuthController.createAuth(username, id, password)

      const created = await AdminService.create({
        ...req.body,
        userId: id,
      })

      res.status(200).json({
        success: true,
        data: created,
      })
    } catch (error) {
      console.log(error)
      res.status(400).json({
        success: false,
        msg: 'บางอย่างผิดพลาด',
      })
    }
  },
  async getOneAdmin(req, res) {
    try {
      const { adminId } = req.params
      const admin = await AdminService.getOne({ userId: adminId })

      res.status(200).json({
        success: true,
        data: admin,
      })
    } catch (error) {
      console.error(error)
      res.status(400).json({
        success: false,
      })
    }
  },
  async getAllAdmin(req, res) {
    const { page = 1, size = 10, q } = req.query

    const calSkip = (page, size) => {
      return (page - 1) * size
    }
    const calPage = (count, size) => {
      return Math.ceil(count / size)
    }

    const results = await AdminService.getAll({
      $or: [{ username: { $regex: q } }, { email: { $regex: q } }],
    })
      .sort({ createdAt: 'desc' })
      .skip(calSkip(page, size))
      .limit(parseInt(size))
      .exec()

    const count = await AdminService.getAll({
      $or: [{ username: { $regex: q } }, { email: { $regex: q } }],
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
  async updateAdmin(req, res) {
    try {
      const { adminId } = req.params

      const updated = await AdminService.update(
        { userId: adminId },
        { ...req.body }
      )

      res.status(200).json({
        success: true,
        updated,
      })
    } catch (error) {
      console.log(error)
      res.status(400).json({
        succes: false,
        msg: 'บางอย่างผิดพลาด',
      })
    }
  },
  async deleteAdmin(req, res) {
    try {
      const { userId } = req.params

      const deleted = await AdminService.delete({ userId })

      res.status(200).json({
        success: true,
        deleted,
      })
    } catch (error) {
      console.log(error)
      res.status(200).json({
        succes: false,
        msg: 'บางอย่างผิดพลาด',
      })
    }
  },
  async getAdminByToken(req, res) {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]

      const user = await AuthController.decode(token)

      const userId = user.userId
      const userInfo = await AdminService.getOne({ userId })
      const userHistory = await AdminHistoryService.getAll({ userId })

      const data = { ...userInfo._doc, userHistory }

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
  async updateByAdmin(req, res) {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]
      const user = await AuthController.decode(token)
      const userId = user.userId
      const updated = await AdminService.update({ userId }, { ...req.body })

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

export default AdminController
