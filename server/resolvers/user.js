import { Users as User, Transactions as Transaction } from '../models/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userResolver = {
    Mutation: {
        signUp: async (_, { input }) => {
            try {
                const { username, name, password, gender } = input

                if (!username || !name || !password || !gender) {
                    throw new Error('All fields are required')
                }
                const existingUser = await User.findOne({ username })
                if (existingUser) {
                    throw new Error('User already exists')
                }

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                // https://avatar-placeholder.iran.liara.run/
                const profilePicture = (username, gender) => {
                    const genderPath = gender.toLowerCase() === 'male' ? 'boy' : 'girl'
                    return `https://avatar.iran.liara.run/public/${genderPath}?username=${username}`
                }
                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: profilePicture(username, gender)
                })
                await newUser.save()
                const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3h' })
                delete newUser.password
                return { user: newUser, token }
            } catch (err) {
                console.error('Error in signUp: ', err)
                throw new Error(err.message || 'Internal server error')
            }
        },

        logIn: async (_, { input }) => {
            try {
                const { username, password } = input
                if (!username || !password) {
                    throw new Error('All fields are required')
                }
                const user = await User.findOne({ username })
                if (!user) {
                    throw new Error('Invalid username or password')
                }
                const validPassword = await bcrypt.compare(password, user.password)
                if (!validPassword) {
                    throw new Error('Invalid username or password')
                }
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' })
                delete user.password
                return { user, token }
            } catch (err) {
                console.error('Error in login:', err)
                throw new Error(err.message || 'Internal server error')
            }
        }
    },
    Query: {
        authUser: async (_, __, { user }) => {
            try {
                return user
            } catch (err) {
                console.error('Error in authUser: ', err)
            }
        },
        user: async (_, { userId }) => {
            try {
                const user = await User.findById(userId)
                return user
            } catch (err) {
                console.error('Error in user query:', err)
                throw new Error(err.message || 'Error getting user')
            }
        }
    },
    User: {
        transactions: async (parent) => {
            try {
                const transactions = await Transaction.find({ userId: parent._id })
                return transactions
            } catch (err) {
                console.error('Error in user.transactions resolver: ', err)
                throw new Error(err.message || 'Internal server error')
            }
        }
    }
}

export default userResolver
