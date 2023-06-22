import { ObjectId } from 'mongodb';
import { db } from '../../config/mongodb'
import { collections } from '../../constants/collections';
import { bannerModel } from '../../models/product-model';

export default {

    getBanner: (bannerId: string): Promise<bannerModel> => {
        return new Promise(async(resolve,reject)=>{
            const banner: bannerModel = await db.get().collection(collections.BANNER_COLLECTION).findOne({_id: new ObjectId(bannerId)})
            resolve(banner)
        })
    },

    activeBanners: (): Promise<bannerModel[]> => {
        return new Promise(async(resolve,reject)=>{
            const banners : bannerModel[] = await db.get().collection(collections.BANNER_COLLECTION).find({active: true}).toArray()
            resolve(banners)
        })
    },

    allBanners: (): Promise<bannerModel[]> => {
        return new Promise(async(resolve,reject)=>{
            const banners: bannerModel[] = await db.get().collection(collections.BANNER_COLLECTION).find().toArray()
            resolve(banners)
        })
    },

    addBanner: (banner: bannerModel)=>{
        return new Promise((resolve,reject)=>{
            banner.active = true
            db.get().collection(collections.BANNER_COLLECTION).insertOne(banner).then((response)=>{
                resolve(response)
            })
        })
    },

    updateBanner: (banner: bannerModel)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.BANNER_COLLECTION).updateOne({_id:new ObjectId(banner._id)},{
                $set: {
                    title: banner.title,
                    subtitle: banner.subtitle,
                    text: banner.text,
                    btnText: banner.btnText,
                    image: banner.image
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },

    activateBanner: (bannerId: string)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.BANNER_COLLECTION).updateOne({_id:new ObjectId(bannerId)},{
                $set: {
                    active: true
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },

    inActivateBanner: (bannerId: string)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.BANNER_COLLECTION).updateOne({_id:new ObjectId(bannerId)},{
                $set: {
                    active: false
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
}