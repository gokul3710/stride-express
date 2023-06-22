import { ObjectId } from 'mongodb';
import { db } from '../../config/mongodb'
import { collections } from '../../constants/collections';
import { brandModel } from '../../models/product-model';

export default {

    getBrand: (brandId: string): Promise<brandModel> => {
        return new Promise(async(resolve,reject)=>{
            const brand: brandModel = await db.get().collection(collections.BRAND_COLLECTION).findOne({_id: new ObjectId(brandId)})
            resolve(brand)
        })
    },

    brandFromName: (brandName: string): Promise<brandModel> => {
        return new Promise(async(resolve,reject)=>{
            const brand: brandModel = await db.get().collection(collections.BRAND_COLLECTION).findOne({name: brandName})
            resolve(brand)
        })
    },

    brandFromId: (brandId: string): Promise<brandModel> => {
        return new Promise(async(resolve,reject)=>{
            const brand: brandModel = await db.get().collection(collections.BRAND_COLLECTION).findOne({_id: new ObjectId(brandId)})
            resolve(brand)
        })
    },

    allBrands: (): Promise<brandModel[]> => {
        return new Promise(async(resolve,reject)=>{
            const brands: brandModel[] = await db.get().collection(collections.BRAND_COLLECTION).find().toArray()
            resolve(brands)
        })
    },

    addBrand: (brand: brandModel)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.BRAND_COLLECTION).insertOne(brand).then((response)=>{
                resolve(response)
            })
        })
    },

    updateBrand: (brand: brandModel)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.BRAND_COLLECTION).updateOne({_id:new ObjectId(brand._id)},{
                $set: {
                    image: brand.image,
                    name: brand.name,
                    description: brand.description
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },

    productByBrand: (brand: string) => {
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collections.PRODUCT_COLLECTION).aggregate([
                {
                    $lookup: {
                        from: collections.BRAND_COLLECTION,
                        localField: 'brand',
                        foreignField: '_id',
                        as: 'brand'
                    }
                },
                {
                    $project: {
                        brand: { $arrayElemAt: ['$brand', 0] },
                        model: 1,
                        description: 1, 
                        color: 1,
                        size: 1,
                        price: 1,
                        material: 1,
                        style: 1,
                        year: 1,
                        condition: 1,
                        images: 1,
                        stock: 1
                    }
                },
                {
                    $project: {
                        brand: '$brand.name',
                        model: 1,
                        description: 1, 
                        color: 1,
                        size: 1,
                        price: 1,
                        material: 1,
                        style: 1,
                        year: 1,
                        condition: 1,
                        images: 1,
                        stock: 1
                    }
                }, 
                {
                    $match: {
                        brand
                    }
                }
            ]).toArray()
            resolve(products)
        })
    },
}