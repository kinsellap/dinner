import mongoose from 'mongoose'

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date_added: { 
        type: Date, 
        default: Date.now 
    },
    date_updated: { 
        type: Date, 
    },
    admin: {
        type: Boolean,
        default: false
    },
})
