import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const RecipeSchema = new Schema({
    title: {
        type: String,
        maxlength: 20,
        required: true
    },
    vegetarian: {
        type: Boolean,
        required: true
    },
    core_ingredient: {
        type: String,
        enum: ["Beans", "Beef", "Chicken", "Fish", "Grains", "Lentils", "Pasta", "Pork", "Other"]
    },
    difficulty: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    premade: {
        type: Boolean,
        required: true
    },
    batch: {
        type: Boolean,
        required: true
    },
    healthy_level: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    prep_time: {
        type: String,
        enum: ["< 10 mins", "10-20 mins", "20-30 mins", "30-40 mins", "> 40 mins"]
    },
    cook_time: {
        type: String,
        enum: ["< 30 mins", "30-45 mins", "45-60 mins", "60-75 mins", "> 75 mins"]
    },
    url: {
        type: String,
        required: true,
        maxlength: 250
    },
    notes: {
        type: String,
        maxlength: 500
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date_added: {
        type: Date,
        default: Date.now
    },
    date_updated: {
        type: Date,
        required: false
    },
})
