import express from 'express'
import { getInfo } from './api.js'
const app = express()

app.disable('x-powered-by')

app.get('/', getInfo)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Geo IP API server started on port ${PORT}`)
})
