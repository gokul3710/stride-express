import { db } from '../../config/mongodb'
import { ObjectId } from 'mongodb'
import { collections } from '../../constants/collections';
import { orderModel, paymentModel, statusModel } from '../../models/order-model';
import userCartHelpers from './user-cart-helpers';

export default {

    allOrders: () => {
        return new Promise(async (resolve, reject) => {
            const orders = await db.get().collection(collections.ORDER_COLLECTION).aggregate([
                {
                    $lookup: {
                        from: collections.USER_COLLECTION,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: collections.PAYMENT_COLLECTION,
                        localField: 'payment',
                        foreignField: '_id',
                        as: 'payment'
                    }
                },
                {
                    $project: {
                        deliveryAddress: 1,
                        discount: 1,
                        items: 1,
                        payment: { $arrayElemAt: ['$payment', 0] },
                        quantity: 1,
                        status: 1,
                        total: 1,
                        tracking: 1,
                        user: { $arrayElemAt: ['$user', 0] }
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ]).toArray()
            resolve(orders)
        })
    },

    getOrdersByUserId: (userId: string) => {
        return new Promise(async (resolve, reject) => {
            const orders = await db.get().collection(collections.ORDER_COLLECTION).find({ userId: new ObjectId(userId) }).sort({ _id: -1 }).toArray()
            resolve(orders)
        })
    },

    placeOrder: (order: orderModel, userId: string) => {
        return new Promise(async (resolve, reject) => {
            order.userId = new ObjectId(userId);

            (order.payment as paymentModel).userId = new ObjectId(userId);

            const emptyCart = await userCartHelpers.emptyCart(userId)

            const products = order.items.map((item) => {
                return { _id: item._id, quantity: item.quantity }
            })

            const stockUpdate = await userCartHelpers.updateStock(products)

            const paymentId = await db.get().collection(collections.PAYMENT_COLLECTION).insertOne(order.payment)

            order.payment = paymentId.insertedId

            const orderId = await db.get().collection(collections.ORDER_COLLECTION).insertOne(order)

            resolve(orderId.insertedId)
        })
    },

    changeOrderStatus(status: statusModel, orderId: string) {
        return new Promise(async (resolve, reject) => {
            let order: orderModel = await db.get().collection(collections.ORDER_COLLECTION).findOne({ _id: new ObjectId(orderId) })
            let payment: paymentModel;
            let date: Date;
            if (order.tracking[status]) {
                resolve("Done")
                return
            } else {
                date = new Date()
                order.tracking[status] = date
            }
            if(status === "delivered"){
                payment = await db.get().collection(collections.PAYMENT_COLLECTION).findOne({_id: order.payment})
                if(payment.method === 'COD')
                await db.get().collection(collections.PAYMENT_COLLECTION).updateOne({_id: order.payment},{
                    $set: {
                        date: date,
                        status: 'paid'
                    }
                })
            }
            db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: new ObjectId(orderId) }, {
                $set: {
                    status: status,
                    tracking: order.tracking
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    cancelOrder: (orderId: string) => {
        return new Promise(async (resolve, reject) => {
            let order: orderModel = await db.get().collection(collections.ORDER_COLLECTION).findOne({ _id: new ObjectId(orderId) })
            if (order.status === 'delivered') {
                resolve({ error: 'Already Delivered' })
                return
            }

            if (order.status === 'cancelled') {
                resolve(order)
                return
            }

            order.tracking['cancelled'] = new Date()

            let payment: paymentModel = await db.get().collection(collections.PAYMENT_COLLECTION).findOne({ _id: order.payment })

            order.payment = payment

            if (payment.method !== 'COD') {
                await db.get().collection(collections.PAYMENT_COLLECTION).updateOne({ _id: order.payment._id },{
                    $set: {
                        status: 'refunded'
                    }
                })
                order.payment.status = 'refunded'
            }
            order.status = 'cancelled'
            db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: new ObjectId(orderId) }, {
                $set: {
                    status: 'cancelled',
                    tracking: order.tracking
                }
            }).then((response) => {
                resolve(order)
            })
        })
    },

    orderDetails: (orderId: string, userId: string) => {
        return new Promise(async (resolve, reject) => {
            const order: orderModel = await db.get().collection(collections.ORDER_COLLECTION).findOne({ _id: new ObjectId(orderId) })
            if (order.userId.toString() !== userId) {
                resolve({ error: "Unauthorized Request" })
            } else {
                const payment: paymentModel = await db.get().collection(collections.PAYMENT_COLLECTION).findOne({ _id: (order.payment as ObjectId) })
                order.payment = payment
                resolve(order)
            }
        })
    },

    paymentsByUserId: (userId: string) => {
        return new Promise(async (resolve, reject) => {
            const payments = await db.get().collection(collections.PAYMENT_COLLECTION).aggregate([
                {
                    $match: {
                        $and: [
                            { userId: new ObjectId(userId) },
                            { status: { $in: ['paid', 'refunded'] } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: collections.ORDER_COLLECTION,
                        localField: '_id',
                        foreignField: 'payment',
                        as: 'order'
                    }
                },
                {
                    $project: {
                        method: 1,
                        status: 1,
                        amount: 1,
                        currency: 1,
                        date: 1,
                        transactionId: 1,
                        userId: 1,
                        order: { $arrayElemAt: ['$order', 0] }
                    }
                },

            ]).toArray()
            resolve(payments)
        })
    },
}