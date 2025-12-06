import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // One cart per user
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'],
                    default: 1,
                },
                size: {
                    type: String,
                    trim: true,
                },
                priceAtPurchase: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Calculate cart total
cartSchema.methods.getCartTotal = function () {
    return this.items.reduce((total, item) => {
        return total + item.priceAtPurchase * item.quantity;
    }, 0);
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
