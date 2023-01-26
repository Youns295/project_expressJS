import express from 'express'
import { body, validationResult } from 'express-validator'
import db from '../db'

const app = express.Router()

app.get('/user', (req, res) => {
//   console.log(req.user)
  res.status(200).json({ message: 'Hello user' })
})

app.put('/user/:uuid',body('name').exists().isString().notEmpty(), async (req, res) => {
  try {
    validationResult(req).throw()
    const updatedUser = await db.user.update({
      where: {
        id: req.params?.uuid
      },
      data: {
        username: req.body.name,
        password: req.body.password,
        Role: req.body.Role
      }
    })
    return res.status(200).json(updatedUser)
  } catch(e) {
    return res.status(400).json({message: e || 'Error while updating'})
  }
})


app.delete('/user/:uuid', async (req, res) => {
  try {
    await db.user.delete({
      where: {
        id: req.params.uuid
      }
    })
  
    return res.status(200).json({message: `Succesfully deleted ${req.params.uuid}`})
  } catch(e) {
    return res.status(400).json({message: e || 'Error while deleting'})
  }
})
export default app