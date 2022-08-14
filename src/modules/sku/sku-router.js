import express from 'express'
import SkuController from './controller/sku-controller.js'

const router = express.Router()

//export all sku
router.get('/export', SkuController.exportAllSku)

//get all sku
router.get('/', SkuController.getAll)

//get sku for confirm order
router.get('/order/:orderId', SkuController.getForConfirm)

//export all sku
router.get('/export', SkuController.exportAllSku)

export default router
