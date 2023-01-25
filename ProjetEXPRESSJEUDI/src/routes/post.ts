import { Request, RequestHandler, Response, Router } from "express";
import { body, check, validationResult } from "express-validator";
import db from "../db";


const app = Router()


app.get('/posts', async (req, res) => {
  const posts = await db.post.findMany({
    where: {
      userId: req.user.id
    },
    include: {

      Comment: true
    }
  })
  return res.status(200).json(posts)
})

app.get(
  '/post/:uuid',
  async (req, res) => {
    try {
      const post = await db.post.findFirstOrThrow({
        where: {
          id: req.params.uuid,
          userId: req.user.id
        },
        include: {
          Comment: true
        }
      })

      return res.status(200).json(post)
    } catch(e) {
      return res.status(400).json({ message: 'Not found' })
    }
  }
)


app.post(
  '/post',
  body('name').exists().isString().notEmpty(),
  async (req: Request, res: Response) => {
    try {
      validationResult(req).throw()
      const createdPost = await db.post.create({
        data: {
          name: req.body.name,
          content: req.body.content,
          userId: req.user.id
        }
      })

      return res.status(200).json(createdPost)
    } catch(e) {
      console.log(e)
      return res.status(400).json({error: e || 'Cannot create Post'})
    }
})

app.put('/post/:uuid', body('name').exists().isString().notEmpty(), async (req, res) => {
  try {
    validationResult(req).throw()
    const updatedPost = await db.post.update({
      where: {
        id: req.params?.uuid,
      },
      data: {
        name: req.body.name
      }
    })
  
    return res.status(200).json(updatedPost)
  } catch(e) {
    return res.status(400).json({message: e || 'Error while updating'})
  }
})

app.delete('/post/:uuid', async (req, res) => {
  try {
    await db.post.delete({
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