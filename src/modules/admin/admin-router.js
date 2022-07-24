import express from 'express'
import AdminController from './controller/admin-controller.js'
// import {
//   adminAuthentication,
//   reciverAuthentication,
//   managerAuthentication,
// } from '../../middleware/authentication.js'

const router = express.Router()

//Create admin
router.post('/', AdminController.create)

//Update admin
router.put('/:adminId', AdminController.updateAdmin)

// get one
router.get('/:adminId', AdminController.getOneAdmin)

//get all admin
router.get('/', AdminController.getAllAdmin)

//delete
router.delete('/:userId', AdminController.deleteAdmin)

export default router
