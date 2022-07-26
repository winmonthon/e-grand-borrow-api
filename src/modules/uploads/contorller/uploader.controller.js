import { uploadImage } from '../utils/upload.js'

const UploaderController = {
  uploadFile: async (req, res) => {
    try {
      if (!req?.file) {
        const error = {
          code: 400,
          message: "Missing 'file' property or 'file' property is null.",
        }
        throw error
      }

      const uploaded = await uploadImage(req.file)

      res.status(201).json({
        success: true,
      })
    } catch (error) {
      console.error(`[ERROR ON UPLOAD FILE] => ${error.message}`)
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  },
}

export default UploaderController
