import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    first_name: {
        type: String,
        maxlength: 20,
        required: true
    },
    last_name: {
        type: String,
        maxlength: 20,
        required: true
    },
    email_address: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 20,
        required: true,
        select: false,
        bcrypt: true
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
    favourite_recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }],
    profile_picture: {
        type: String 
    }
})

UserSchema.plugin(require('mongoose-bcrypt'));
