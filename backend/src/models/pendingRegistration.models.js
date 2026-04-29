import mongoose from 'mongoose';

const pendingRegistrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        otpExpiresAt: {
            type: Date,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
    },
    {
        timestamps: true,
    }
);

export const PendingRegistration =
    mongoose.models.PendingRegistration ||
    mongoose.model('PendingRegistration', pendingRegistrationSchema);
