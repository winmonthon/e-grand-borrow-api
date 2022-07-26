import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import adminRouter from './src/modules/admin/admin-router.js'
import authRouter from './src/modules/auth/auth-router.js'
import userRouter from './src/modules/user/user-router.js'
import productRouter from './src/modules/product/product-router.js'
import skuRouter from './src/modules/sku/sku-router.js'
import orderRouter from './src/modules/order/order-router.js'
import uploadRouter from './src/modules/uploads/uploader.route.js'

dotenv.config()
const app = express()

try {
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('MONGO CONNECTION OPEN')
} catch (error) {
  console.log(error)
  console.log('MONGO CONNECTION ERROR')
}

app.use(cors())

app.use(express.json()) //!!!!!!!!!!!!!alway must use it before Line handle!!!!!!!!!!!!!!!
app.use(express.urlencoded({ extended: true }))

app.use('/admin', adminRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/sku', skuRouter)
app.use('/order', orderRouter)
app.use('/upload', uploadRouter)

app.get('/', (req, res) =>
  res.send({
    message: 'server running',
    date: new Date(),
    version: '1.3',
  })
)
const PORT = process.env.PORT || 3000
try {
  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
  })
} catch (error) {
  console.log('error', error)
}
