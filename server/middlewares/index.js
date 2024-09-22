import { expressMiddleware as middleware } from '@apollo/server/express4'
import jwt from 'jsonwebtoken'
import { Users } from '../models/index.js'

export const expressMiddleware = (server) =>
    middleware(server, {
        context: async ({ req }) => {
            try {
                const token = req.headers.authorization?.split(' ')[1]
                
                if (token) {
                    const { id } = jwt.verify(token, process.env.JWT_SECRET)
                    return { user: await Users.findOne({ _id: id }) }
                }
            } catch (error) {
                if (error instanceof jwt.TokenExpiredError) {
                    return { error: { message: 'Token has expired', code: 'JWT_ERROR' } }
                }
                console.error(`Error in expressMiddleware: ${error}`)
                return { user: null }
            }
        }
    })
