import { db } from '../../config/mongodb'
import { ObjectId } from 'mongodb'
import { collections } from '../../constants/collections';
import { cartTotalModel, cartModel } from '../../models/user-model';
import { response } from 'express';
import { productModel } from '../../models/product-model';

export default {

    getCart: (userId: string): Promise<cartModel> => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).findOne({ user: new ObjectId(userId) }).then((response) => {
                resolve(response);
            })
        })
    },

    addToCart: (data: { productId: string, count?: number }, userId: string) => {
        const productObj = {
            item: new ObjectId(data.productId),
            quantity: data.count ? data.count : 1
        }
        data.count = data.count? data.count : 1
        return new Promise(async (resolve, reject) => {
            const cart: cartModel = await db.get().collection(collections.CART_COLLECTION).findOne({ user: new ObjectId(userId) })
            if (cart) {
                const productExist = cart.products.findIndex(product => product.item == data.productId)
                if (productExist != -1) {

                    let product: productModel = await db.get().collection(collections.PRODUCT_COLLECTION).findOne({ _id: new ObjectId(data.productId) })

                    let cartProduct = cart.products.filter((cartProduct) => cartProduct.item.toString() === data.productId)
                    if (Number(product.stock) < (cartProduct[0].quantity + data.count)) {
                        resolve({ error: "No More Stock" })
                        return false
                    }

                    db.get().collection(collections.CART_COLLECTION)
                        .updateOne({ user: new ObjectId(userId), 'products.item': new ObjectId(data.productId) },
                            {
                                $inc: { 'products.$.quantity': data.count ? data.count : 1 }
                            }
                        ).then((response) => {
                            resolve(cart._id);
                        })
                } else {
                    db.get().collection(collections.CART_COLLECTION)
                        .updateOne({ user: new ObjectId(userId) },
                            {
                                $push: { products: productObj }

                            }
                        ).then((response) => {
                            resolve(cart._id)
                        })
                }
            } else {
                const cartObj = {
                    user: new ObjectId(userId),
                    products: [productObj]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve(response.insertedId)
                })
            }
        })
    },

    removeFromCart: (productId: string, userId: string) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION)
                .updateOne({ user: new ObjectId(userId) },
                    {
                        $pull: { products: { item: new ObjectId(productId) } }
                    }
                ).then((response) => {
                    resolve({ removeProduct: true });
                })
        })
    },

    cartProducts: (userId: string) => {
        return new Promise(async (resolve, reject) => {
            let cartProducts = await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] },
                    }
                },
                {
                    $lookup: {
                        from: collections.BRAND_COLLECTION,
                        localField: 'product.brand',
                        foreignField: '_id',
                        as: 'product.brand'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: 1,
                        total: { $multiply: ['$quantity', { $convert: { input: '$product.price', to: 'int' } }] }
                    }
                }
            ]).toArray()
            cartProducts = cartProducts.map((cartProduct)=>{
                cartProduct.product.brand = cartProduct.product.brand[0]
                return cartProduct
            })
            resolve(cartProducts)
        })
    },

    cartTotal: (userId: string): Promise<cartTotalModel> => {
        return new Promise(async (resolve, reject) => {
            const total: cartTotalModel[] = await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                        coupon: '$coupon'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        coupon: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        subtotal: { $sum: { $multiply: ['$quantity', { $convert: { input: '$product.price', to: 'int' } }] } },
                        items: { $sum: { $multiply: ['$quantity', 1] } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        subtotal: 1,
                        items: 1,
                    }
                },
            ]).toArray()
            resolve(total[0])
        })
    },

    changeProductQuantity: (productData: { count: string | number, productId: string }, userId: string) => {

        const count = Number(productData.count);

        return new Promise(async (resolve, reject) => {

            let product: productModel = await db.get().collection(collections.PRODUCT_COLLECTION).findOne({ _id: new ObjectId(productData.productId) })

            let cart: cartModel = await db.get().collection(collections.CART_COLLECTION).findOne({ user: new ObjectId(userId) })

            let cartProduct = cart.products.filter((cartProduct) => cartProduct.item.toString() === productData.productId)

            if (Number(product.stock) < (cartProduct[0].quantity + count)) {
                resolve({ error: "No More Stock" })
                return false
            }

            db.get().collection(collections.CART_COLLECTION)
                .updateOne({ user: new ObjectId(userId), 'products.item': new ObjectId(productData.productId) },
                    {
                        $inc: { 'products.$.quantity': count }
                    }
                )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });

    },

    emptyCart: (userId: string) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).deleteOne({ user: new ObjectId(userId) }).then((response) => {
                resolve(response)
            })
        })
    },

    addCouponToCart: (couponId: string, userId: string) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).updateOne({ user: new ObjectId(userId) }, {
                $set: {
                    coupon: new ObjectId(couponId)
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    updateStock: (products: { _id: ObjectId, quantity: number }[]) => {
        return new Promise((resolve, reject) => {

            const productCollection = db.get().collection(collections.PRODUCT_COLLECTION);
            const updatePromises = products.map(item =>
                productCollection.updateOne(
                    { _id: new ObjectId(item._id) },
                    { $inc: { stock: -Number(item.quantity) } }
                )
            );

            Promise.all(updatePromises).then(results => {
                resolve(response)
            }).catch(error => {
                console.error('Error updating stock:', error);
                reject(error)
            });
        })
    }
}