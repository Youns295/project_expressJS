import { RequestHandler, Router } from 'express'
import { body, validationResult } from 'express-validator'
import db from '../db'

const router = Router()

const isUsersItem: RequestHandler = async (req, res, next) => {
  try {
    const isOwner = await db.comment.findFirstOrThrow({
      where: {
        Post: {
          userId: req.user.id
        },
      }
    })
    if (isOwner) {
      return next()
    }
    throw new Error('You should not be here')
  } catch(e) {
    return res.status(400).json({ message: 'You are not the owner' })
  }
} 

router.post(
  '/Comment',
  body('PostId').isUUID(),
  body('description').isString(),
  isUsersItem,
  async (req, res) => {
    try {
      validationResult(req).throw()
      const createdComment  = await db.comment.create({
        data: {
          PostId: req.body.PostId,
          description: req.body.description
        },
      })

      return res.status(201).json(createdComment)
    } catch (e) {
      return res.status(400).json({ message: e || 'Error during creation'})
    }
  }
)

router.put(
  '/Comment/:uuid',
  isUsersItem,
  body('description').isLength({ min: 1 }),
  async (req, res) => {
    try {
      validationResult(req).throw()
      const updatedItem = await db.comment.update({
        where: {
          id: req.params?.uuid
        },
        data: {
          description: req.body.description
        }
      })
      res.status(200).json(updatedItem)
    } catch(e) {
      return res.status(400).json({ message: e || 'Error during update'})
    }
  }
)

router.delete(
  '/Comment/:uuid',
  isUsersItem,
  async (req, res) => {
    try {
      const deletedId = req.params.uuid
      await db.comment.delete({
        where: {
          id: deletedId
        }
      })
      res.status(200).json({ message: `Successfully deleted ${deletedId}`})
    } catch(e) {
      return res.status(400).json({ e: e || 'Error during deletion'})
    }
  }
)

export default router