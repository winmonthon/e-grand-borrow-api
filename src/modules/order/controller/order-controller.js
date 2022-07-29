import OrderService from '../service/order-service.js'
import AuthController from '../../auth/controller/auth-controller.js'
import IdLogic from '../../../plugin/id-logic/id-logic.js'
import dotenv from 'dotenv'
import orderStatusEnum from '../../../common/order-status-enum.js'
import SkuService from '../../sku/service/sku-service.js'
import useStatusEnum from '../../../common/use-status-enum.js'
import ProductService from '../../product/service/product-service.js'
import userTypeEnum from '../../../common/user-type-enum.js'

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
      const token = req?.headers?.authorization?.split(' ')[1]

      const user = await AuthController.decode(token)

      if (!user) {
        throw 'บัญชีผู้ใช้งานผิดพลาด กรุณาลองเข้าสู้ระบบใหม่อีกครั้ง'
      }

      if (user.userType === userTypeEnum.MEMBER) {
        return ProductController.getAllByToken(req, res, user)
      }

      const { page = 1, size = 10, q = '' } = req.query

      const calSkip = (page, size) => {
        return (page - 1) * size
      }
      const calPage = (count, size) => {
        return Math.ceil(count / size)
      }

      let data = []

      const results = await OrderService.getAll({
        $or: [
          { orderId: { $regex: q } },
          { 'createdBy.username': { $regex: q } },
        ],
      })
        .sort({ createdAt: 'desc' })
        .skip(calSkip(page, size))
        .limit(parseInt(size))
        .exec()

      const count = await OrderService.getAll({
        $or: [
          { orderId: { $regex: q } },
          { 'createdBy.username': { $regex: q } },
        ],
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
  async confirmOrder(req, res) {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]

      const user = await AuthController.decode(token)
      const { orderId } = req.params
      const { skuId, adminNote } = req.body

      const orderInfo = await OrderService.getOne({ orderId })

      const usingBy = orderInfo.createdBy

      let productConfirmed = []
      for (let sku of skuId) {
        const found = await SkuService.getOne({ _id: sku })

        if (!found || found.useStatus === useStatusEnum.USING) {
          throw 'สินค้าบางอย่างถูกใช้งานไปแล้ว กรุณาลองใหม่'
        }

        await SkuService.update(
          { _id: sku },
          {
            usingBy,
            useStatus: useStatusEnum.USING,
          }
        )
        const productInfo = await ProductService.getOne({
          _id: found.productId,
        })

        productConfirmed.push({ ...found._doc, productInfo })
        console.log(productConfirmed)
      }

      await OrderService.update(
        { orderId },
        {
          updatedBy: user,
          orderStatus: orderStatusEnum.USING,
          adminNote,
          productConfirmed,
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
  async getAllByToken(req, res, user) {
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
        'createdBy.userId': user.userId,
      })
        .sort({ createdAt: 'desc' })
        .skip(calSkip(page, size))
        .limit(parseInt(size))
        .exec()

      const count = await OrderService.getAll({
        $or: [{ orderId: { $regex: q } }],
        'createdBy.userId': user.userId,
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
  async returnOrder(req, res) {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]

      const user = await AuthController.decode(token)
      const { password } = req.body
      const checkPassword = await AuthController.checkPassword(
        user.username,
        password
      )

      if (!checkPassword) {
        return res.status(400).json({
          msg: 'รหัสไม่ถูกต้อง',
        })
      }

      const { orderId } = req.params
      const orderInfo = await OrderService.getOne({ orderId })

      for (let sku of orderInfo.productConfirmed) {
        await SkuService.update(
          { _id: sku._id },
          {
            usingBy: null,
            useStatus: useStatusEnum.NO_USE,
          }
        )
      }

      await OrderService.update(
        { orderId },
        {
          orderStatus: orderStatusEnum.DONE,
        }
      )

      res.status(200).json({ sucess: true })
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  },
  async cancelByUser(req, res) {
    try {
      const { orderId } = req.params
      await OrderService.update(
        { orderId },
        {
          orderStatus: orderStatusEnum.CANCEL,
        }
      )

      res.status(200).json({ success: true })
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  },
}

export default ProductController
