import { Request, Response, response } from 'express';
import { bannerModel } from '../../models/product-model';
import { filesRequest } from '../../models/request-model';
import bannerHelpers from '../../helpers/shop/banner-helpers';
import cloudinary from '../../config/cloudinary';


export default {

    getBanners: (req: Request, res: Response) => {
        bannerHelpers.allBanners().then((banners: bannerModel[]) => {
            res.status(200).json(banners)
        })
    },

    getActiveBanners: (req: Request, res: Response) => {
        bannerHelpers.activeBanners().then((banners: bannerModel[]) => {
            res.status(200).json(banners)
        })
    },

    getBanner: (req: Request, res: Response) => {
        bannerHelpers.getBanner((req.query.bannerId as string)).then((banner: bannerModel) => {
            res.status(200).json(banner)
        })
    },

    postAddBanner: async (req: Request, res: Response) => {
        if (req.body) {
            const result = await cloudinary.uploader.upload(req.file.path);
            const image = result.secure_url;
            req.body.image = image
            bannerHelpers.addBanner(req.body).then((response) => {
                res.status(200).json("Done")
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },

    putUpdateBanner: async (req: Request, res: Response) => {
        if (req.body) {
            if (req?.file?.path) {
                const result = await cloudinary.uploader.upload(req.file.path);
                req.body.image = result.secure_url;
            }
            bannerHelpers.updateBanner(req.body).then((response) => {
                res.status(200).json("Done")
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },

    putActivateBanner: (req: Request, res: Response) => {
        if (req.params.bannerId) {
            bannerHelpers.getBanner((req.params.bannerId as string)).then((response) => {
                res.status(200).json(response)
            })
        }
    },

    putInActivateBanner: (req: Request, res: Response) => {
        if (req.params.bannerId) {
            bannerHelpers.getBanner((req.params.bannerId as string)).then((response) => {
                res.status(200).json(response)
            })
        }
    },
}