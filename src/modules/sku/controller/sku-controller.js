import SkuService from '../service/sku-service.js'
import dotenv from 'dotenv'

dotenv.config()

const SkuController = {
  async getAll(req, res) {
    try {
      const { page = 1, size = 10, q = '', productId } = req.query

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
}

export default SkuController
