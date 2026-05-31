
import express, { type Application } from 'express'
import pg from 'pg'
import { userRoute } from './modules/auth/auth.routes'
import { issuesRoute } from './modules/issues/issue.route'
const app : Application = express()


app.use(express.json())
app.use(express.text())
app.use(express.urlencoded())

app.get('/', (req, res) => {
  res.send('Welcome to devpulse!')
})

app.use("/api/auth",userRoute)
app.use("/api/issues",issuesRoute)
export default app;