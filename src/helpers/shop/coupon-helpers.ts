import { ObjectId } from 'mongodb';
import { db } from '../../config/mongodb'
import { collections } from '../../constants/collections';
import { couponModel } from '../../models/product-model';

export default {

    getCoupon: (couponId: string): Promise<couponModel> => {
        return new Promise(async(resolve,reject)=>{
            const coupon: couponModel = await db.get().collection(collections.COUPON_COLLECTION).findOne({_id: new ObjectId(couponId)})
            resolve(coupon)
        })
    },

    couponFromCode: (couponCode: string): Promise<couponModel> => {
        return new Promise(async(resolve,reject)=>{
            const coupon: couponModel = await db.get().collection(collections.COUPON_COLLECTION).findOne({code: couponCode.toUpperCase()})
            resolve(coupon)
        })
    },

    allCoupons: (): Promise<couponModel[]> => {
        return new Promise(async(resolve,reject)=>{
            const coupons: couponModel[] = await db.get().collection(collections.COUPON_COLLECTION).find().toArray()
            resolve(coupons)
        })
    },

    useCoupon: (couponCode: string): Promise<couponModel> => {
        return new Promise(async(resolve,reject)=>{
            const coupon: couponModel  = await db.get().collection(collections.COUPON_COLLECTION).findOne({code: couponCode})
            resolve(coupon)
        })
    },

    addCoupon: (coupon: couponModel)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.COUPON_COLLECTION).insertOne(coupon).then((response)=>{
                resolve(response)
            })
        })
    },

    deleteCoupon: (couponId: string)=>{
        return new Promise(async(resolve,reject)=>{
            const deleted = await db.get().collection(collections.COUPON_COLLECTION).deleteOne({_id:new ObjectId(couponId)})
            // const deleteFromCart = await db.get().collection(collections.CART_COLLECTION).update({coupon: new ObjectId(couponId)},{
            //     $set: {
            //         coupon: null
            //     }
            // })
            resolve(deleted)
        })
    },

    updateCoupon: (coupon: couponModel)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.COUPON_COLLECTION).updateOne({_id:new ObjectId(coupon._id)},{
                $set: {
                    code: coupon.code,
                    amount: Number(coupon.amount),
                    minPurchase: coupon.minPurchase,
                    expiry: coupon.expiry,
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },

    removeCouponFromCart: (userId: string)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.CART_COLLECTION).updateOne({user: new ObjectId(userId)},{
                $set: {
                    coupon: null
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
}