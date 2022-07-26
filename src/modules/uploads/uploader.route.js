import express from 'express'
import UploaderController from './contorller/uploader.controller.js'
import Multer from 'multer'
import { storage } from './utils/upload.js'

const router = express.Router()

const multer = Multer({
  storage: Multer.memoryStorage(),
})

const upload = Multer({
  storage,
})

router.post('/', upload.single('file'), (req, res) => {
  res.status(200).json(req.file)
})

// router.post('/', upload.single('file'), UploaderController.uploadFile)

export default router
