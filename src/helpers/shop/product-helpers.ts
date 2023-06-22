import { ObjectId } from 'mongodb';
import { db } from '../../config/mongodb'
import { collections } from '../../constants/collections';
import { productModel as Product, brandModel } from '../../models/product-model';
import { toProduct } from '../../middlewares/toProductSchema';

export default {
    allProducts: (): Promise<Product[]> => {
        return new Promise(async (resolve, reject) => {
            const products: Product[] = await db.get().collection(collections.PRODUCT_COLLECTION).aggregate([
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
                }
            ]).toArray()
            resolve(products)
        })
    },

    product: (productId: string): Promise<Product> => {
        return new Promise(async (resolve, reject) => {
            const product: Product = await db.get().collection(collections.PRODUCT_COLLECTION).findOne({ _id: new ObjectId(productId) })
            const brand: brandModel = await db.get().collection(collections.BRAND_COLLECTION).findOne({ _id: product.brand })
            product.brand = brand.name
            resolve(product)
        })
    },

    addProduct: (product: Product) => {
        return new Promise(async (resolve, reject) => {
            let brand = product.brand
            product = await toProduct(product)
            db.get().collection(collections.PRODUCT_COLLECTION).insertOne(product).then((response) => {
                resolve({ ...response, brand })
            })
        })
    },

    deleteProduct: (productId: string) => {
        return new Promise(async (resolve, reject) => {
            const deleted = await db.get().collection(collections.PRODUCT_COLLECTION).deleteOne({ _id: new ObjectId(productId) })
            const products = await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },

    updateProduct: (product: Product) => {
        return new Promise(async (resolve, reject) => {
            product = await toProduct(product)
            db.get().collection(collections.PRODUCT_COLLECTION).updateOne({ _id: new ObjectId(product._id) }, {
                $set: {
                    brand: product.brand,
                    model: product.model,
                    color: product.color,
                    size: product.size,
                    price: product.price,
                    material: product.material,
                    style: product.style,
                    year: product.year,
                    stock: product.stock
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    addStock: (productId: string, stock: number) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION).updateOne({ _id: new ObjectId(productId) }, {
                $set: {
                    stock: Number(stock)
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    searchProducts: (searchString: string) => {
        return new Promise(async (resolve, reject) => {
            let search = new RegExp(searchString, "i");
            let searchProducts = await db.get().collection(collections.PRODUCT_COLLECTION).aggregate([
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
                        $or: [
                            { brand: { $regex: search } },
                            { model: { $regex: search } },
                            { style: { $regex: search } },
                            { material: { $regex: search } },
                            { color: { $regex: search } }
                        ]
                    }
                }
            ]).toArray();
            resolve(searchProducts)
        })
    },

    updateImages: (productId: string ,productImages: string[]) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION).updateOne({ _id: new ObjectId(productId) }, {
                $set: {
                    images: productImages
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },
}