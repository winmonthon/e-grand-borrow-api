import express from 'express'
import AuthController from './controller/auth-controller.js'

const router = express.Router()

//login
router.post('/login', AuthController.login)

//admin login
router.post('/login/admin', AuthController.loginAdmin)

export default router
