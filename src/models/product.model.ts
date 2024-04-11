import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ["cate1","cate2"],
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema)