import express from 'express'
import UserController from './controller/user-controller.js'
// import {
//   adminAuthentication,
//   reciverAuthentication,
//   managerAuthentication,
// } from '../../middleware/authentication.js'

const router = express.Router()

//Create user
router.post('/', UserController.create)

//Get one user by token
router.get('/token', UserController.getUserByToken)

//update by user
router.put('/token', UserController.updateByUser)

//Get one user
// router.get('/:userId', UserController.getOneUser)

//Get all user
router.get('/', UserController.getAllUser)

//Update user
router.put('/:userId', UserController.updateUser)

//Delete user
router.delete('/:userId', UserController.deleteUser)
export default router
