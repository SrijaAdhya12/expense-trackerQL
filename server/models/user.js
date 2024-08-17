import mongoose, { Schema } from 'mongoose'

const user = new Schema(
    {
        username: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        profilePicture: { type: String, default: '' },
        gender: { type: String, enum: ['male', 'female'] }
    },
    { timestamps: true }
)

export default mongoose.model('users', user)
