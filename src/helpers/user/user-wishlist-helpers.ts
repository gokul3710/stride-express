import { db } from '../../config/mongodb'
import { ObjectId } from 'mongodb'
import { collections } from '../../constants/collections';

export default {

    addToWishlist: (productId: string, userId: string) => {
        const productObj = {
            item: new ObjectId(productId),
        }
        return new Promise(async (resolve, reject) => {
            const userWishlist = await db.get().collection(collections.WISHLIST_COLLECTION).findOne({ user: new ObjectId(userId) })
            if (userWishlist) {
                const productExist = userWishlist.products.findIndex(product => product.item == productId)
                if (productExist != -1) {
                    resolve("Product Already In Wishlist")
                } else {
                    db.get().collection(collections.WISHLIST_COLLECTION)
                        .updateOne({ user: new ObjectId(userId) },
                            {
                                $push: { products: productObj }
                            }
                        ).then((response) => {
                            resolve(response)
                        })
                }
            } else {
                const wishlistObj = {
                    user: new ObjectId(userId),
                    products: [productObj]
                }
                db.get().collection(collections.WISHLIST_COLLECTION).insertOne(wishlistObj).then((response) => {
                    resolve(response)
                })
            }
        })
    },

    removeFromWhislist: (productId: string, userId: string) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.WISHLIST_COLLECTION)
                .updateOne({ _id: new ObjectId(userId) },
                    {
                        $pull: { products: { item: new ObjectId(productId) } }
                    }
                ).then((response) => {
                    resolve({ removeProduct: true });
                })
        })
    },

    wishlistProducts: (userId: string) => {
        return new Promise(async (resolve, reject) => {
            const wishlistProducts = await db.get().collection(collections.WISHLIST_COLLECTION).aggregate([
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
                        product: { $arrayElemAt: ['$product', 0] },
                    }
                }
            ]).toArray()
            resolve(wishlistProducts)
        })
    },
    
    wishlistCount:(userId: string)=>{
        return new Promise(async(resolve,reject)=>{
            let wishlistCount: number
            const wishlist = await db.get().collection(collections.WISHLIST_COLLECTION).findOne({user:new ObjectId(userId)})
            if(wishlist){
                wishlistCount = wishlist.products.length
            }
            resolve(wishlistCount)
        })
    }
}