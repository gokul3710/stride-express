import { ObjectId } from "mongodb";
import { userAddressModel } from "./user-model";
import { productModel } from "./product-model";

export interface orderModel {
    _id?: ObjectId | string,
    userId?: ObjectId | string,
    deliveryAddress : userAddressModel,
    items: orderItemModel[],
    tracking: trackingModel,
    payment: paymentModel | ObjectId,
    status: statusModel,
    total: number,
    quantity: number,
    discount: number
}

export interface trackingModel {
    placed: Date | false | string,
    packed: Date | false | string,
    shipped: Date | false | string,
    arrived: Date  | false | string,
    delivered: Date | false | string,
    returned: Date | false | string,
    cancelled: Date | false | string
}

export interface paymentModel {
    _id? :ObjectId,
    userId?: ObjectId | string
    method: 'paypal' | 'razorpay' | 'COD',
    status: "paid" | 'pending' | 'failed' | 'refunded',
    transactionId?: string,
    amount: number,
    currency: 'INR' | 'USD'
    date: Date | string | false
}

export interface orderItemModel extends productModel{
    quantity: number
    total: number
}

export type statusModel = 'pending' | 'placed' | 'packed' |'shipped' | 'arrived' | 'delivered' | 'returned' | 'cancelled'