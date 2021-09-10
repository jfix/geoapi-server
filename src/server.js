import express from 'express'
import { getCityInfo, getCountryInfo } from './api.js'
const app = express()

app.disable('x-powered-by')

app.get('/', getCityInfo)
app.get('/country', getCountryInfo)
app.get('/city', getCityInfo)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Geo IP API server started on port ${PORT}`)
})
