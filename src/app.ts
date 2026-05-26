
import express, { type Application } from 'express'
import pg from 'pg'
import { userRoute } from './modules/auth/auth.routes'
const app : Application = express()


app.use(express.json())
app.use(express.text())
app.use(express.urlencoded())

app.get('/', (req, res) => {
  res.send('Welcome to devpulse!')
})

app.use("/api/auth",userRoute)

export default app;