import { ObjectId } from 'mongodb';

export interface userModel{
    _id: ObjectId | string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    image?: string,
    password?: string,
    username: string,
    gender: "Male" | "Female",
    notifications?: number,
    block?: boolean
}

export interface userSignupModel{
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    image?: string,
    password?: string,
    username?: string,
    otp?: string,
    googleAuth?: boolean,
    gender: "Male" | "Female",
    notifications?: number
}

export interface helperResponseModel{
    user?: userModel | null,
    status?: boolean,
    error?: string| null,
    response?: any
    state: 'login' | 'signup'
}

export interface userAddressModel{
    _id?: ObjectId
    name: string,
    phone: string,
    house: string,
    street: string
    city: string,
    state: string,
    country: "India",
    pincode: string,
    landmark?: string,
    default: boolean
}

export interface cartModel {
    _id?: ObjectId | string,
    user: ObjectId | string,
    products: {item: ObjectId| string, quantity: number}[],
    coupon: ObjectId | string
}

export interface cartTotalModel{
    _id?: null | ObjectId,
    subtotal: number,
    items: number,
    coupon: ObjectId | string,
    discount?: number,
    shipping?: number,
    couponCode?: string
}