import { Request, Response, response } from 'express';
import { authRequest } from '../../models/request-model';
import userWishlistHelpers from '../../helpers/user/user-wishlist-helpers';
import userOrderHelpers from '../../helpers/user/user-order-helpers';
import { orderModel, statusModel } from '../../models/order-model';
import { isOrderModel } from '../../middlewares/typeguards';
import { helperResponseModel } from '../../models/user-model';

export default {

    getAllOrders: (req: Request, res: Response) => {
        userOrderHelpers.allOrders().then((response) => {
            res.status(200).json(response)
        })
    },

    getOrders: (req: Request, res: Response) => {
        userOrderHelpers.getOrdersByUserId((req as authRequest).user.userId).then((response) => {
            res.status(200).json(response)
        })
    },

    postPlaceOrder: (req: Request, res: Response) => {
        if (req.body) {
            const order = req.body
            if (isOrderModel(order)) {
                userOrderHelpers.placeOrder(order, (req as authRequest).user.userId).then((response) => {
                    res.status(200).json(response)
                })
            } else {
                res.status(400).json('Order cannot be placed')
            }
        } else {
            res.status(400).json('Order cannot be placed')
        }
    },

    putChangeOrderStatus: (req: Request, res: Response) => {
        
        if (req.body?.status) {
            userOrderHelpers.changeOrderStatus((req.body.status as statusModel), req.body.orderId).then((response) => {
                res.status(200).json(response)
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },

    putCancelOrder: (req: Request, res: Response) => {
        if (req.body.orderId) {
            userOrderHelpers.cancelOrder(req.body.orderId).then((response: helperResponseModel)=>{
                if(response.error){
                    res.status(400).json(response.error)
                }else{
                    res.status(200).json(response)
                }
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },

    postOrderDetails: (req: Request, res: Response) => {
        if (req.body?.orderId) {
            userOrderHelpers.orderDetails(req.body.orderId, (req as authRequest).user.userId).then((response) => {
                res.status(200).json(response)
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },

    getPayments: (req: Request, res: Response) => {
        userOrderHelpers.paymentsByUserId((req as authRequest).user.userId).then((response) => {
            res.status(200).json(response)
        })
    },
}