import AuthService from '../service/auth-service.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserService from '../../user/service/user-service.js'
import AdminService from '../../admin/service/admin-service.js'
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

const AuthController = {
  async createAuth(username, userId, password) {
    try {
      const hash = await bcrypt.hash(password, 12)
      const created = await AuthService.createAuth({
        userId,
        username,
        password: hash,
      })

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
  async login(req, res) {
    const { username, password } = req.body

    const user = await AuthService.getOneAuth({ username })

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
      })
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        msg: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
      })
    }

    const userInfo = await UserService.getOne({ username })

    if (!userInfo) {
      return res.status(401).json({
        success: false,
        msg: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
      })
    }

    const token = jwt.sign(
      {
        username: userInfo.username,
        userId: userInfo.userId,
      },
      process.env.SECRET,
      {
        expiresIn: '7d',
      }
    )

    res.status(200).json({
      success: true,
      token,
      userInfo,
    })
  },
  async getOneAuth(req, res) {
    const { authId } = req.params

    const found = await AuthService.getOneAuth({
      _id: authId,
    })

    res.status(200).json({
      suuccess: true,
      found,
    })
  },
  async getAllAuth(req, res) {
    const { page = 1, size = 10 } = req.query

    const calSkip = (page, size) => {
      return (page - 1) * parseInt(size)
    }
    const calPage = (count, size) => {
      return Math.ceil(count / parseInt(size))
    }

    const results = await AuthService.getAllAuth(req.query)
      .skip(calSkip(page, parseInt(size)))
      .limit(parseInt(size))
      .exec()

    const count = await AuthService.getAllAuth(req.query)
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
  async updateAuth(req, res) {
    const { authId } = req.params
    const { updateBy, Status, productList, from, to, tracking } = req.body

    const payload = {
      updateBy,
      Status,
      tracking,
      productList,
      from,
      to,
    }

    const updated = await AuthService.updateAuth({ _id: authId }, payload)

    res.status(200).json({
      success: true,
      updated,
    })
  },
  async deleteAuth(req, res) {
    const { authId } = req.params

    const deleted = await AuthService.deleteAuth({
      _id: authId,
    })

    res.status(200).json({
      success: true,
      deleted,
    })
  },
  async decode(token) {
    const decoded = jwt.decode(token, SECRET_KEY)

    return decoded
  },
  async loginAdmin(req, res) {
    const { username, password } = req.body

    const user = await AuthService.getOneAuth({ username })

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
      })
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        msg: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
      })
    }

    const userInfo = await AdminService.getOne({ username })

    if (!userInfo) {
      return res.status(401).json({
        success: false,
        msg: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
      })
    }

    const token = jwt.sign(
      {
        username: userInfo.username,
        userId: userInfo.userId,
        role: userInfo.role,
        rescueStation: userInfo.rescueStation?.rescueStationId || '-',
      },
      process.env.SECRET,
      {
        expiresIn: '7d',
      }
    )

    res.status(200).json({
      success: true,
      token,
      userInfo,
    })
  },
}

export default AuthController
