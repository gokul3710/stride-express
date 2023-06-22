import { Request, Response } from 'express';
import couponHelpers from '../../helpers/shop/coupon-helpers';
import { couponModel } from '../../models/product-model';
import userCartHelpers from '../../helpers/user/user-cart-helpers';
import { authRequest } from '../../models/request-model';
import { HttpException } from '../../middlewares/error';

export default {

    getCoupons: (req: Request, res: Response) => {
        couponHelpers.allCoupons().then((response: couponModel[]) => {
            res.status(200).json(response)
        })
    },

    getCouponFromId: (req: Request, res: Response) => {
        if(req.query.couponId){
            couponHelpers.getCoupon(req.query.couponId as string ).then((response: couponModel) => {
                res.status(200).json(response)
            })
        }else{
            res.status(400).json("Invalid Request")
        }
    },

    getCouponFromCode: (req: Request, res: Response) => {
        if(req.params.couponCode){
            couponHelpers.couponFromCode(req.params.couponCode as string ).then((response: couponModel) => {
                res.status(200).json(response)
            })
        }else{
            res.status(400).json("Invalid Request")
        }
    },

    postAddCoupon: (req: Request, res: Response) => {
        if (req.body) {
            couponHelpers.addCoupon(req.body).then((response) => {
                res.status(200).json("Done")
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },

    deleteCoupon: (req: Request, res: Response) => {
        if (req.params?.couponId) {
            couponHelpers.deleteCoupon(req.params.couponId).then((response) => {
                res.status(200).json("Done")
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },

    putUpdateCoupon: (req: Request, res: Response) => {
        if (req.body) {
            couponHelpers.updateCoupon({...req.body,couponId: req.params.couponId}).then((response) => {
                res.status(200).json("Done")
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },

    postUseCoupon: async (req: authRequest, res: Response) => {
        if (req.body.couponCode) {
            const request = req.body
            const coupon: couponModel = await couponHelpers.useCoupon(request.couponCode)
            if (coupon) {
                if (coupon?.minPurchase > request.subtotal) {
                    res.status(404).json("Minimum purchase not met.")
                    return
                }

                if (new Date(coupon?.expiry) < new Date()) {
                    res.status(400).json("Coupon Expired.")
                    return
                }

                userCartHelpers.addCouponToCart(coupon._id.toString(), req.user.userId).then((response) => {
                    res.status(200).json(coupon)
                })
            } else {
                res.status(400).json(new HttpException('Invalid Coupon',400))
            }


        } else {
            res.status(400).json(new HttpException("Invalid Request",400))
        }
    },

    putRemoveCouponFromCart: (req: Request, res: Response) => {
        couponHelpers.removeCouponFromCart(((req as authRequest).user.userId)).then((response) => {
            res.status(200).json("Done")
        })
    }
}