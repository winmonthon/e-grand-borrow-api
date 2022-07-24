import express from 'express'
import SkuController from './controller/sku-controller.js'

const router = express.Router()

//get all sku
router.get('/', SkuController.getAll)

export default router
