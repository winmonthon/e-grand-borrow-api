import SkuService from '../service/sku-service.js'
import dotenv from 'dotenv'
import OrderService from '../../order/service/order-service.js'
import useStatusEnum from '../../../common/use-status-enum.js'
import conditionEnum from '../../../common/condition-enum.js'

dotenv.config()

const SkuController = {
  async getAll(req, res) {
    try {
      const {
        page = 1,
        size = 10,
        q = '',
        productId,
        useStatus = '',
      } = req.query

      const calSkip = (page, size) => {
        return (page - 1) * size
      }
      const calPage = (count, size) => {
        return Math.ceil(count / size)
      }

      const results = await SkuService.getAll({
        $or: [{ serialNumber: { $regex: q } }, { place: { $regex: q } }],
        productId,
      })
        .sort({ createdAt: 'desc' })
        .skip(calSkip(page, size))
        .limit(parseInt(size))
        .exec()

      const count = await SkuService.getAll({
        $or: [{ serialNumber: { $regex: q } }, { place: { $regex: q } }],
        productId,
      })
        .sort({ createdAt: 'desc' })
        .countDocuments()
        .exec()

      res.status(200).json({
        success: true,
        currentPage: +page,
        allPages: +calPage(count, size),
        currentCount: results.length,
        totalCount: count,
        data: results,
      })
    } catch (err) {
      console.log(err)
      res.statis(400).json({
        msg: 'บางอย่างผิดพลาดกรุณาลองใหม่',
      })
    }
  },
  async getForConfirm(req, res) {
    try {
      const { orderId } = req.params

      const orderInfo = await OrderService.getOne({
        orderId,
      })

      const productList = orderInfo.productList

      let data = []

      for (let each of productList) {
        const canUseSku = await SkuService.getAll({
          productId: each.product._id,
          useStatus: useStatusEnum.NO_USE,
          $or: [
            { condition: conditionEnum.GOOD },
            { condition: conditionEnum.MODERATE },
          ],
        })
          .countDocuments()
          .exec()

        const skus = await SkuService.getAll({
          productId: each.product._id,
          useStatus: useStatusEnum.NO_USE,
          $or: [
            { condition: conditionEnum.GOOD },
            { condition: conditionEnum.MODERATE },
          ],
        })

        data.push({
          reqInfo: each,
          canUse: {
            amount: canUseSku,
            skus,
          },
        })
      }

      res.status(200).json(data)
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  },
}

export default SkuController
