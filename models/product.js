import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    variantsId: {
        type: String,
        index: { unique: true },
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    variantsTitle: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;