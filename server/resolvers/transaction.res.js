import Transaction from '../models/transaction.js'
const transactionResolver = {
    Query: {
        transactions: async (_, __, context) => {
            try {
                if (!context.getUser()) {
                    throw new Error('Unauthorized')
                }
                const userId = await context.getUser().id
                const transactions = await Transaction.find({ userId })
                return transactions
            } catch (error) {
                console.error('Error getting transactions', error)
                throw new Error('Error getting transactions')
            }
        },
        transaction: async (_, { transactionId }) => {
            try {
                const transaction = await Transaction.findById(transactionId)
                return transaction
            } catch (error) {
                console.error('Error getting transaction', error)
                throw new Error('Error getting transaction')
            }
        },
        categoryStatistics: async (_, __, context) => {
            if (!context.getUser()) throw new Error('Unauthorized')

            const userId = context.getUser()._id
            const transactions = await Transaction.find({ userId })
            const categoryMap = {}
            transactions.forEach((transaction) => {
                if (!categoryMap[transaction.category]) {
                    categoryMap[transaction.category] = 0
                }
                categoryMap[transaction.category] += transaction.amount
            })
            return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }))
        }
    },
    Mutation: {
        createTransaction: async (_, { input }, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
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
            } catch (error) {
                console.error('Error updating transaction', error)
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
    }
}

export default transactionResolver
