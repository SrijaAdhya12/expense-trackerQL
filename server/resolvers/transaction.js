import { Transactions as Transaction, Users as User } from '../models/index.js'

const transactionResolver = {
    Query: {
        transactions: async (_, __, { user, error }) => {
            try {
                if (!user) {
                    throw new Error(JSON.stringify(error))
                }
                const { _id: userId } = user
                const transactions = await Transaction.find({ userId }).sort({ date: -1 })
                return transactions
            } catch (err) {
                console.error('Error getting transactions:', err)
                throw new Error('Error getting transactions')
            }
        },
        transaction: async (_, { transactionId }) => {
            try {
                const transaction = await Transaction.findById(transactionId)
                return transaction
            } catch (err) {
                console.error('Error getting transaction:', err)
                throw new Error('Error getting transaction')
            }
        },
        categoryStatistics: async (_, __, { user, error }) => {
            if (!user) {
                throw new Error(JSON.stringify(error))
            }
            const { _id: userId } = user
            const transactions = await Transaction.find({ userId })
            const categoryMap = {}

            // const transactions = [
            // 	{ category: "expense", amount: 50 },
            // 	{ category: "expense", amount: 75 },
            // 	{ category: "investment", amount: 100 },
            // 	{ category: "saving", amount: 30 },
            // 	{ category: "saving", amount: 20 }
            // ];

            transactions.forEach((transaction) => {
                if (!categoryMap[transaction.category]) {
                    categoryMap[transaction.category] = 0
                }
                categoryMap[transaction.category] += transaction.amount
            })

            // categoryMap = { expense: 125, investment: 100, saving: 50 }

            return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }))
            // return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
        }
    },
    Mutation: {
        createTransaction: async (_, { input }, { user }) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: user._id
                })
                await newTransaction.save()
                return newTransaction
            } catch (err) {
                console.error('Error creating transaction:', err)
                throw new Error('Error creating transaction')
            }
        },
        updateTransaction: async (_, { input }) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
                    new: true
                })
                return updatedTransaction
            } catch (err) {
                console.error('Error updating transaction:', err)
                throw new Error('Error updating transaction')
            }
        },
        deleteTransaction: async (_, { transactionId }) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId)
                return deletedTransaction
            } catch (err) {
                console.error('Error deleting transaction:', err)
                throw new Error('Error deleting transaction')
            }
        }
    },
    Transaction: {
        user: async (parent) => {
            const userId = parent.userId
            try {
                const user = await User.findById(userId)
                return user
            } catch (err) {
                console.error('Error getting user:', err)
                throw new Error('Error getting user')
            }
        }
    }
}

export default transactionResolver
