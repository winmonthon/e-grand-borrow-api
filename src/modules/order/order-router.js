import express from 'express'
import OrderController from './controller/order-controller.js'

const router = express.Router()

//create order
router.post('/', OrderController.createOrder)

//create order
router.get('/', OrderController.getAll)

//get by orderID
router.get('/:orderId', OrderController.getByOrderId)

//order reject
router.put('/reject/:orderId', OrderController.rejectOrder)

//confirm order
router.put('/confirm/:orderId', OrderController.confirmOrder)

//return order
router.put('/return/:orderId', OrderController.returnOrder)

export default router
