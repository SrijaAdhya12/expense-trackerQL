import passport from 'passport'
import bcrypt from 'bcryptjs'

import User from '../models/users.js'
import { GraphQLLocalStrategy } from 'graphql-passport'

export const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        console.log('serialising user')
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        console.log('deserializeUser')
        try {
            const user = await User.findbyId(id)
            done(null, user)
        } catch (error) {
            done(err)
        }
    })

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username })
                if (!user) {
                    throw new Error('Invalid')
                }
            } catch (error) {
                return done(error)
            }
        })
    )
}
