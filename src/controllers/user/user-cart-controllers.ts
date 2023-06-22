import { Request, Response } from 'express';
import { authRequest } from '../../models/request-model';
import userCartHelpers from '../../helpers/user/user-cart-helpers';
import { cartModel, cartTotalModel, helperResponseModel } from '../../models/user-model';
import couponHelpers from '../../helpers/shop/coupon-helpers';

export default {

    postAddToCart: (req: Request, res: Response) => {
        if (req.body?.productId) {
            userCartHelpers.addToCart(req.body, (req as authRequest).user.userId).then((response: helperResponseModel) => {
                if(response.error){
                    res.status(401).json(response.error)
                }else{
                    res.status(200).json(response)
                }
            })
        } else {
            res.status(400).json('Invalid Request')
        }
    },

    putRemoveFromCart: (req: Request, res: Response) => {
        if (req.params?.productId) {

            userCartHelpers.removeFromCart(req.params.productId, (req as authRequest).user.userId).then((response) => {
                res.status(200).json(response)
            })
        } else {
            res.status(400).json('Invalid Request')
        }
    },

    getCartProducts: (req: Request, res: Response) => {
        userCartHelpers.cartProducts((req as authRequest).user.userId).then((response) => {
            res.status(200).json(response)
        })
    },

    getCartTotal: async (req: Request, res: Response) => {
        const cartTotal: cartTotalModel = await userCartHelpers.cartTotal((req as authRequest).user.userId)
        if (cartTotal) {
            if (cartTotal.subtotal < 1000) {
                cartTotal.shipping = 100
            } else {
                cartTotal.shipping = 0
            }
            const cart: cartModel = await userCartHelpers.getCart((req as authRequest).user.userId)

            if (cart.coupon) {
                const coupon = await couponHelpers.getCoupon(cart.coupon.toString())
                if (coupon) {
                    if (new Date(coupon.expiry) < new Date()) {
                        cartTotal.discount = 0
                        couponHelpers.removeCouponFromCart((req as authRequest).user.userId.toString())
                    } else {
                        cartTotal.discount = coupon.amount
                        cartTotal.couponCode = coupon.code
                    }
                } else {
                    cartTotal.discount = 0
                    couponHelpers.removeCouponFromCart((req as authRequest).user.userId.toString())
                }
            } else {
                cartTotal.discount = 0
            }
            res.status(200).json(cartTotal)
        }else{
            res.status(200).json("Cart Is Empty")
        }
    },

    putChangeProductQuantity: (req: Request, res: Response) => {
        if (req.body) {
            userCartHelpers.changeProductQuantity(req.body, (req as authRequest).user.userId).then((response: helperResponseModel) => {
                if(response.error){
                    res.status(404).json(response.error)
                }else{
                    res.status(200).json(response)
                }
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },
}