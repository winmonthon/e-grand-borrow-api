import express from 'express'
import ProductController from './controller/product-controller.js'

const router = express.Router()

//createproduct
router.post('/', ProductController.create)

//get Product
router.get('/', ProductController.getAll)

//get by id
router.get('/:productId', ProductController.getProductById)

//get by id
router.put('/:productId', ProductController.updateProduct)

export default router
