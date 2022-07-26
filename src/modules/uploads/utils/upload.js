import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config()

export const v2 = cloudinary.v2

v2.config({
  cloud_name: process.env.CLOUNDINARY_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_SECRET,
})

export const storage = new CloudinaryStorage({
  cloudinary: v2,
  folder: 'e-grand-borrow',
})

const randomFileName = () => {
  const now = new Date()
  const ran = Math.floor(Math.random() * 100)
  let result = `${ran}${+now}`
  result = parseInt(result).toString(16)

  return result
}

export const uploadImage = async (file) => {
  try {
    // Upload the image
    const storage = new CloudinaryStorage({
      cloudinary: v2,
      folder: 'e-grand-borrow',
    })
    return storage.public_id
  } catch (error) {
    throw error
  }
}

//only use when file from line api
// export const uploadFile = (file, fileType, groupId, fileName) => {
//   return new Promise((resolve, reject) => {
//     const randomName = randomFileName()
//     const name = `${groupId}/${fileName || randomName}.${fileType}`
//     const bucket = storage.bucket(BUCKET_NAME)
//     const blob = bucket.file(name)
//     const blobStream = blob.createWriteStream({
//       resumable: false,
//     })

//     blobStream
//       .on('finish', () => {
//         const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${name}`
//         resolve({
//           publicUrl,
//           prefix: `https://storage.googleapis.com/${BUCKET_NAME}/`,
//           name,
//         })
//       })
//       .on('error', (err) => {
//         console.log(err)
//         reject(`Unable to upload, something went wrong`)
//       })
//       .end(file)
//   })
// }

// export const uploadLogic = (file) => {
//   console.log('file', file)
//   return new Promise((resolve, reject) => {
//     const randomName = randomFileName()
//     const { originalname, buffer } = file
//     const fileName = originalname.split('.')
//     const extention = fileName[fileName.length - 1]
//     const name = `package-and-category/${randomName}.${extention}`
//     const bucket = storage.bucket(BUCKET_NAME)
//     const blob = bucket.file(name)
//     const blobStream = blob.createWriteStream({
//       resumable: false,
//     })

//     blobStream
//       .on('finish', () => {
//         const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${name}`
//         resolve({
//           publicUrl,
//           prefix: `https://storage.googleapis.com/${BUCKET_NAME}`,
//           name,
//         })
//       })
//       .on('error', (err) => {
//         console.log(err)
//         reject(`Unable to upload, something went wrong`)
//       })
//       .end(buffer)
//   })
// }
