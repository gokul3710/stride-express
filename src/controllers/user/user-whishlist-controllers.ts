import { Request, Response } from 'express';
import { authRequest } from '../../models/request-model';
import userWishlistHelpers from '../../helpers/user/user-wishlist-helpers';

export default {

    postAddToWishlist: (req: Request, res: Response) => {
        if (req.body?.productId) {
            userWishlistHelpers.addToWishlist(req.body.productId, (req as authRequest).user.userId).then((response) => {
                res.status(200).json(response)
            })
        } else {
            res.status(400).json('Invalid Request')
        }
    },

    postRemoveFromWishlist: (req: Request, res: Response) => {
        if (req.body?.productId) {
            userWishlistHelpers.removeFromWhislist(req.body.productId, (req as authRequest).user.userId).then((response) => {
                res.status(200).json(response)
            })
        } else {
            res.status(400).json('Invalid Request')
        }
    },

    getWishlistProducts: (req: Request, res: Response) => {
        userWishlistHelpers.wishlistProducts((req as authRequest).user.userId).then((response) => {
            res.status(200).json(response)
        })
    },

    getWishlistCount: (req: Request, res: Response) => {
        userWishlistHelpers.wishlistCount((req as authRequest).user.userId).then((response) => {
            res.status(200).json(response)
        })
    }
}