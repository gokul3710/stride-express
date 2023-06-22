import { orderModel } from "../models/order-model";

export function isOrderModel(order: any): order is orderModel {
    if (!order) {
        return false;
    }

    if (typeof order.deliveryAddress !== "object") {
        console.log(1);
        
        return false;
    }

    if (!Array.isArray(order.items) || order.items.some(item => typeof item !== "object")) {
        console.log(2);

        return false;
    }

    if (typeof order.tracking !== "object" || Object.values(order.tracking).some(date => date !== false && !(date instanceof Date)  && typeof date !== 'string')) {
        console.log(3);
        
        return false;
    }

    if (typeof order.payment !== "object" || typeof order.payment.method !== "string" || typeof order.payment.status !== "string" || typeof order.payment.amount !== "number" || typeof order.payment.currency !== "string" || !(order.payment.date instanceof Date)  && typeof order.payment.date !== 'string' && order.payment.date !== false) {
        console.log(4);
       
        return false;
    }

    if (typeof order.status !== "string" || !["pending", "placed", "packed", "shipped", "arrived", "delivered", "returned", "cancelled"].includes(order.status)) {
        console.log(5);
        
        return false;
    }

    if (typeof order.total !== "number" || typeof order.quantity !== "number" || typeof order.discount !== "number") {
        console.log(6);
        
        return false;
    }

    return true;
}
