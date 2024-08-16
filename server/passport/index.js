import passport from 'passport'
import bcrypt from 'bcryptjs'
import { GraphQLLocalStrategy } from 'graphql-passport'
import User from '../models/user.js'


export const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        console.log('Serializing user')
        return done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        console.log('Deserializing user')
        try {
            return done(null, await User.findById(id))
        } catch (err) {
            return done(err)
        }
    })

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username })
                if (!user) {
                    throw new Error('Invalid username or password')
                }
                if (!bcrypt.compare(password, user.password)) {
                    throw new Error('Invalid username or password')
                }
                return done(null, user)
            } catch (err) {
                return done(err)
            }
        })
    )
}
