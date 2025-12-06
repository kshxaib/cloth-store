import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'],
                },
                price: {
                    type: Number,
                    required: true,
                },
                size: {
                    type: String,
                },
            },
        ],
        shippingAddress: {
            name: {
                type: String,
                required: [true, 'Please provide recipient name'],
            },
            address: {
                type: String,
                required: [true, 'Please provide address'],
            },
            city: {
                type: String,
                required: [true, 'Please provide city'],
            },
            postalCode: {
                type: String,
                required: [true, 'Please provide postal code'],
            },
            country: {
                type: String,
                required: [true, 'Please provide country'],
                default: 'Pakistan',
            },
            phone: {
                type: String,
                required: [true, 'Please provide phone number'],
            },
        },
        paymentResult: {
            id: String,
            status: String,
            email_address: String,
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        status: {
            type: String,
            enum: ['confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'confirmed',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
