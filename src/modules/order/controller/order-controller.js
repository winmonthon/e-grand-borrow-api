import OrderService from '../service/order-service.js'
import AuthController from '../../auth/controller/auth-controller.js'
import IdLogic from '../../../plugin/id-logic/id-logic.js'
import dotenv from 'dotenv'
import orderStatusEnum from '../../../common/order-status-enum.js'

dotenv.config()

const ProductController = {
  async createOrder(req, res) {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]

      const user = await AuthController.decode(token)

      const orderId = await IdLogic.createId('orderId')

      await OrderService.create({ ...req.body, orderId, createdBy: user })

      res.status(200).json({
        success: true,
      })
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  },
  async getAll(req, res) {
    try {
      const { page = 1, size = 10, q = '' } = req.query

      const calSkip = (page, size) => {
        return (page - 1) * size
      }
      const calPage = (count, size) => {
        return Math.ceil(count / size)
      }

      let data = []

      const results = await OrderService.getAll({
        $or: [{ orderId: { $regex: q } }],
      })
        .sort({ createdAt: 'desc' })
        .skip(calSkip(page, size))
        .limit(parseInt(size))
        .exec()

      const count = await OrderService.getAll({
        $or: [{ orderId: { $regex: q } }],
      })
        .sort({ createdAt: 'desc' })
        .countDocuments()
        .exec()

      for (let each of results) {
        let total = 0
        for (let product of each.productList) {
          total += product.amount
        }

        data.push({ ...each._doc, total })
      }

      res.status(200).json({
        success: true,
        currentPage: +page,
        allPages: +calPage(count, size),
        currentCount: results.length,
        totalCount: count,
        data: data,
      })
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  },
  async getByOrderId(req, res) {
    try {
      const { orderId } = req.params

      const found = await OrderService.getOne({ orderId })

      res.status(200).json(found)
    } catch (err) {
      res.status(400).json(err)
    }
  },
  async rejectOrder(req, res) {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]

      const user = await AuthController.decode(token)
      const { orderId } = req.params
      const { adminNote } = req.body

      await OrderService.update(
        { orderId },
        {
          orderStatus: orderStatusEnum.REJECTED,
          updatedBy: user,
          adminNote,
        }
      )

      res.status(200).json({
        success: true,
      })
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  },
}

export default ProductController
