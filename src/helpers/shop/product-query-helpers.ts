import { db } from '../../config/mongodb'
import { collections } from '../../constants/collections';

export default {

    // filterProducts: (filters: any, pageCount: number) => {
    //     return new Promise(async(resolve,reject)=>{
    //         let products = await db.get().collection(collections.PRODUCT_COLLECTION).find(filters).toArray()
    //         resolve(products)
    //     })
    // },

    filterProductsAgg: (filters: any, sort: any, pageCount: number) => {
        
        return new Promise(async(resolve,reject)=>{
            let productsCount = await db.get().collection(collections.PRODUCT_COLLECTION).aggregate([
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
                    $match: filters
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    }
                }
            ]).toArray()
            
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
                // {
                //     $lookup: {
                //         from: collections.STYLE_COLLECTION,
                //         localField: 'style',
                //         foreignField: '_id',
                //         as: 'style'
                //     }
                // },
                {
                    $match: filters
                },
                {
                    $sort: sort ? sort : {_id : 1}
                },
                {
                    $skip: (pageCount - 1) * 12
                },
                {
                    $limit: 12
                }
            ]).toArray()
            resolve({products,productsCount: productsCount[0]?.count})
        })
    }
}