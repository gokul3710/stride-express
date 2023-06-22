import { db } from '../../config/mongodb'
import { collections } from '../../constants/collections';

export default {
    updateprice: () => {
        return new Promise(async(resolve, reject)=>{
            let images = [
                'https://res.cloudinary.com/djep4papd/image/upload/v1684667946/mqpnogly1vrv4xf0eg0q.png',
                'https://res.cloudinary.com/djep4papd/image/upload/v1684667946/jwo6xmcn2uk88txc2n20.png',
                'https://res.cloudinary.com/djep4papd/image/upload/v1684667946/kvsyu0xf35lnjro9lofn.png',
                'https://res.cloudinary.com/djep4papd/image/upload/v1684667946/dhisgvc3frlytekbpyyu.png'
              ]
            const users = await db.get().collection(collections.PRODUCT_COLLECTION).updateMany(
                {},
                { $set: { images:  images} }
              );
            resolve(users)
        })
    },
    
    allUsers: () => {
        return new Promise((resolve, reject)=>{
            const users = db.get().collection(collections.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    }
}