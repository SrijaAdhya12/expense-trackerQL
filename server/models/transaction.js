import mongoose, { Schema } from 'mongoose'

const transaction = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    paymentType: { type: String, enum: ['cash', 'card'], required: true },
    category: { type: String, enum: ['saving', 'expense', 'investment'], required: true },
    amount: { type: Number, required: true },
    location: { type: String, default: 'Unknown' },
    date: { type: Date, required: true }
})

export default mongoose.model('Transaction', transaction)
