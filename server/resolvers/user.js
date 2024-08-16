import User from '../models/user.js'
import bcrypt from 'bcryptjs'

const userResolver = {
    Mutation: {
        signUp: async (_, { input }, context) => {
            try {
                const { username, name, password, gender } = input
                if (!username || !name || !password || !gender) {
                    throw new Error('All fields are required')
                }
                if (await User.findOne({ username })) {
                    throw new Error('User already exits')
                }
                const profilePic = {
                    male: `https://avatar.iran.liara.run/public/boy?username=${username}`,
                    female: `https://avatar.iran.liara.run/public/girl?username=${username}`,
                    default: `https://avatar.iran.liara.run/public/?username=${username}`
                }
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                // https://avatar-placeholder.iran.liara.run/

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: profilePic[gender] ?? profilePic.default
                })
                await newUser.save()
                await context.login(newUser)
                return newUser
            } catch (error) {
                console.error('Error in Sign up', error)
                throw new Error(error.message || 'Internal server error')
            }
        },
        login: async (_, { input }, context) => {
            try {
                const { username, password } = input
                if (!username || !password) {
                    throw new Error('All fields are required')
                }
                const { user } = await context.authenticate('graphql-local', { username, password })

                await context.login(user)
                return user
            } catch (err) {
                console.error('Error in login:', err)
                throw new Error(err.message || 'Internal server error')
            }
        },
        logout: async (_, __, context) => {
            try {
                await context.logout()
                context.req.session.destroy((error) => {
                    if (error) throw error
                })
                context.res.clearCookie('connect.id')
                return { message: 'Logged out successfully' }
            } catch (error) {
                console.error('Error in logout', error)
                throw new Error(error.message || 'Internal server error')
            }
        }
    },
    Query: {
        authUser: async (_, __, context) => {
            try {
                const user = await context.getUser()
                return user
            } catch (error) {
                console.error('Error in AuthUser', error)
                throw new Error(error.message || 'Internal server error')
            }
        },
        user: async (_, { userId }) => {
            try {
                return await User.findById(userId)
            } catch (error) {
                console.error('Error in user query', error)
                throw new Error(error.message || 'Error getting user')
            }
        }
    }
}

export default userResolver
