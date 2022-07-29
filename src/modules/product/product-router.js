import express from 'express'
import ProductController from './controller/product-controller.js'

const router = express.Router()
//product report
router.get('/report', ProductController.productReport)

//createproduct
router.post('/', ProductController.create)

//get Product
router.get('/', ProductController.getAll)

//get by id
router.get('/:productId', ProductController.getProductById)

//get by id
router.put('/:productId', ProductController.updateProduct)

//delete product
router.delete('/:productId', ProductController.deleteProduct)

export default router
