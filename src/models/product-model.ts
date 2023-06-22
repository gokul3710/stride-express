import { ObjectId } from "mongodb"

export interface productModel{
    _id?: ObjectId,
    brand: string,
    model: string,
    description: string
    color: string,
    size: number,
    price: number,
    material: string,
    style: string,
    year: number,
    images: string[],
    stock: number
}

export interface couponModel{
    _id?: ObjectId | string
    code: string,
    amount: number,
    expiry: Date | string,
    minPurchase: number
}

export interface notificationModel{
    _id?: ObjectId | string,
    date: Date | string,
    image?: string,
    title: string,
    description: string,
    subDescription: string,
    product?: ObjectId | string
}

export interface brandModel{
    _id?: ObjectId | string,
    image: string,
    name: string,
    description: string
}

export interface bannerModel{
    _id: ObjectId | string
    title: string,
    subtitle: string,
    text: string,
    btnText: string,
    image: string
    active: boolean
}