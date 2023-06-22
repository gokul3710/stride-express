import { db } from "../config/mongodb"
import { productModel } from "../models/product-model"
import { collections } from "../constants/collections"

export const toProduct = async(product: productModel)=>{
    product.price = Number(product.price)
    product.stock = Number(product.stock)
    product.year = Number(product.year)
    product.size = Number(product.size)
    let brand = await db.get().collection(collections.BRAND_COLLECTION).findOne({name: (product.brand).toLowerCase()})
    if(brand){
        product.brand = brand._id
    }
    // let style = await db.get().collection(collections.STYLE_COLLECTION).findOne({name: (product.style).toLowerCase()})
    // product.style = style._id
    return product
}