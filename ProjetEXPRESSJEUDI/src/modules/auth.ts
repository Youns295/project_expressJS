import { User } from '@prisma/Client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RequestHandler } from "express"

// FUNCTION TO CREATE A JWT TOKEN
export const createJWT = (user: User) => {

    const token = jwt.sign({
        id: user.id,
        username: user.username,
    }, process.env.JWT_SECRET as string);
    return token 
}

// envoie d'un token qui est verifie 
export const protect : RequestHandler = (req, res, next) => {
    const bearer = req.headers.authorization;


    if(!bearer) {
        return res.status(401).json({ message: 'Not authorized' })
    }

// recuperer le token et le bearer
    const [, token] = bearer.split(' ');


    // verifier le token
    if (!token) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    // verifier si le token est bien en string 
    try {
        if (typeof process.env.JWT_SECRET !== 'string') {
            return res.status(401).json({ message: 'Not authorized' })
        }
        // verifier si le token est valide ou non 
    const payload = jwt.verify(token, process.env.JWT_SECRET) as User;
    
    req.user = payload

    return next()
} catch(e) {
    return res.status(401).json({ message: 'Not authorized' })
}
}

export const comparePassword = (password: string, hash: string) => {
    return bcrypt.compare(password, hash)
}

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 10)
}