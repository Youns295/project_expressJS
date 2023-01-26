import { Request, RequestHandler } from "express";
import db from "../db";


interface TypedRequestParam extends Request {
    body: {
      content: any;
      name?: string;
      
    }
  }

export const createNewPost : RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        if (!(req.body?.name)) {
            throw new Error('Invalid body provided')
          }
        const post = await db.post.create({
            data: {
                name: req.body.name,
                content: req.body.content,
                userId: req.user.id
            }
        })
        return res.status(201).json({ post })
    } catch(e) {
        res.status(400).json({ error: e?.toString() })
    }
}

export const updatePost : RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        if (!(req.body?.name)) {
            throw new Error('Invalid body provided')
          }


        const post = await db.post.update({
            where: {
                id: (req.params.id)
            },
            data: {
                name: req.body.name,
            }
        })
        return res.status(201).json({ post })
    } catch(e) {
        res.status(400).json({ error: e?.toString() })
    }
}  