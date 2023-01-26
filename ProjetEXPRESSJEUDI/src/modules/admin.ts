import db from "../db";
import { updatePost } from "../handlers/post";
import { RequestHandler } from "express"
import post from "../routes/post";


export const AdminOrOther : RequestHandler = async (req, res, next) => {
// const auth = await db.post.findUnique;
try{

if(req.user.Role == 'ADMIN') {
    return next()
    // || req.user.id === post.id
}  
  return res.status(401).json({ message: 'Unauthorized' })
} catch(e){
    console.log(e)
    return res.status(500).json({ message: e?.toString() })
}
}