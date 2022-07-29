import ProductService from '../service/product-service.js'
import SkuService from '../../sku/service/sku-service.js'
import AuthController from '../../auth/controller/auth-controller.js'
import useStatusEnum from '../../../common/use-status-enum.js'
import conditionEnum from '../../../common/condition-enum.js'
import dotenv from 'dotenv'

dotenv.config()

const ProductController = {
  async create(req, res) {
    try {
      console.log(req.body)
      const token = req?.headers?.authorization?.split(' ')[1]

      const user = await AuthController.decode(token)
      console.log(user)
      const { sku } = req.body
      const createdProduct = await ProductService.create({
        ...req.body,
        createdBy: user,
      })

      for (let each of sku) {
        await SkuService.create({
          ...each,
          productId: createdProduct._id,
        })
      }

      res.status(200).json({
        success: true,
      })
    } catch (err) {
      console.log(err)
      res.status(400).json({
        success: false,
        msg: 'บางอย่างผิดพลาดกรุณาลองใหม่',
      })
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

      const results = await ProductService.getAll({
        $or: [{ name: { $regex: q } }],
      })
        .sort({ createdAt: 'desc' })
        .skip(calSkip(page, size))
        .limit(parseInt(size))
        .exec()

      const count = await ProductService.getAll({
        $or: [{ name: { $regex: q } }],
      })
        .sort({ createdAt: 'desc' })
        .countDocuments()
        .exec()

      let dataMapped = []

      for (let each of results) {
        const totalCount = await SkuService.getAll({
          productId: each._id,
        })
          .countDocuments()
          .exec()

        const usingCount = await SkuService.getAll({
          productId: each._id,
          useStatus: useStatusEnum.USING,
        })
          .countDocuments()
          .exec()

        const defectiveCount = await SkuService.getAll({
          productId: each._id,
          condition: conditionEnum.DEFECTIVE,
        })
          .countDocuments()
          .exec()

        const waitingRepairCount = await SkuService.getAll({
          productId: each._id,
          condition: conditionEnum.WAITIN_FOR_REPAIR,
        })
          .countDocuments()
          .exec()

        const noUsingCount = totalCount - usingCount
        const canNotUseCount = waitingRepairCount + defectiveCount
        const canUseCount =
          totalCount - usingCount - waitingRepairCount - defectiveCount

        dataMapped.push({
          ...each._doc,
          totalCount,
          usingCount,
          noUsingCount,
          defectiveCount,
          waitingRepairCount,
          canNotUseCount,
          canUseCount,
        })
      }
      res.status(200).json({
        success: true,
        currentPage: +page,
        allPages: +calPage(count, size),
        currentCount: results.length,
        totalCount: count,
        data: dataMapped,
      })
    } catch (err) {
      console.log(err)
      res.status(400).json({
        msg: 'บางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง',
      })
    }
  },
  async getProductById(req, res) {
    try {
      const { productId } = req.params

      const product = await ProductService.getOne({ _id: productId })

      const sku = await SkuService.getAll({ productId }).sort({
        createdAt: 'desc',
      })

      res.status(200).json({
        product,
        sku,
      })
    } catch (err) {
      console.log(err)
      res.status(400).json({
        msg: err,
      })
    }
  },
  async updateProduct(req, res) {
    try {
      const { productId } = req.params

      const { name, sku, deletedSkus, image } = req.body

      await ProductService.update({ _id: productId }, { name, image })

      for (let each of sku) {
        const updated = await SkuService.update(
          { _id: each._id },
          {
            ...each,
          }
        )

        if (!updated) {
          await SkuService.create({
            ...each,
            productId,
          })
        }
      }

      for (let each of deletedSkus) {
        await SkuService.delete({ _id: each._id })
      }

      res.status(200).json({
        success: true,
      })
    } catch (err) {
      console.log(err)
      res.status(400).json({
        msg: err,
      })
    }
  },
  async deleteProduct(req, res) {
    try {
      const { productId } = req.params
      console.log(productId)
      const skus = await SkuService.getAll({ productId })
      for (let sku of skus) {
        await SkuService.delete({ _id: sku._id })
      }

      await ProductService.delete({ _id: productId })

      res.status(200).json({ success: true })
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  },
  async productReport(req, res) {
    try {
      const allSkus = await SkuService.getAll()

      const allUsingSku = allSkus.filter(
        (sku) => sku.useStatus === useStatusEnum.USING
      )

      const allNoUsingSku = allSkus.filter(
        (sku) =>
          sku.useStatus === useStatusEnum.NO_USE &&
          (sku.condition === conditionEnum.GOOD ||
            sku.condition === conditionEnum.MODERATE)
      )

      const allWaitForRepairSku = allSkus.filter(
        (sku) => sku.condition === conditionEnum.WAITIN_FOR_REPAIR
      )

      const allDefectSku = allSkus.filter(
        (sku) => sku.condition === conditionEnum.DEFECTIVE
      )

      const allSkusCount = allSkus.length
      const allUsingSkuCount = allUsingSku.length
      const allNoUsingSkuCount = allNoUsingSku.length
      const allDefectSkuCount = allDefectSku.length
      const allWaitForRepairSkuCount = allWaitForRepairSku.length

      res.status(200).json({
        allSkusCount,
        allUsingSkuCount,
        allNoUsingSkuCount,
        allDefectSkuCount,
        allWaitForRepairSkuCount,
      })
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  },
}

export default ProductController
