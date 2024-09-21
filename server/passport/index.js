import passport from 'passport'
import bcrypt from 'bcryptjs'

import { Users as User } from '../models/index.js'
import { GraphQLLocalStrategy } from 'graphql-passport'

export const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        console.log('Serializing user')
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        console.log('Deserializing user')
        
        try {
            console.log('Inside Try')
            const user = await User.findById(id)
            console.log('After Try', user)
            done(null, user)
        } catch (err) {
            console.error('Error deserializing user: ', err)
            done(err)
        }
    })

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username })
                if (!user) {

                    throw new Error('Invalid username or password')
                }
                const validPassword = await bcrypt.compare(password, user.password)

                if (!validPassword) {
                    throw new Error('Invalid username or password')
                }

                return done(null, user)
            } catch (err) {
                return done(err)
            }
        })
    )
}
