import express from 'express'
import * as dotenv from 'dotenv'
import userRoutes from './routes/user'
import PostRoutes from './routes/post'
import CommentRoutes from './routes/Comment'
import { protect } from './modules/auth'
import { createNewUser, signIn } from './handlers/user'
import config from './config'
import path from 'path'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = config.port

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
   res.status(200).json({ message: 'hello' }) // res.sendFile(path.resolve("public/Connexion.html")) 
  })
  

app.use('/api', protect, [
  userRoutes,
  PostRoutes,
  CommentRoutes
])



app.post('/signUp', createNewUser)
app.get('/signUp', (req, res) => {
  res.sendFile(path.resolve("public/Inscription.html")) 
})

app.post('/signIn', signIn) 
app.get('/signIn', (req, res) => {
  res.sendFile(path.resolve("public/Connexion.html")) })

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})