import { Request, Response } from 'express';
import { brandModel, productModel } from '../../models/product-model';
import brandHelpers from '../../helpers/shop/brand-helpers';
import cloudinary from '../../config/cloudinary';
import { HttpException } from '../../middlewares/error';

export default {

    getBrands: (req: Request, res: Response) => {
        brandHelpers.allBrands().then((brands: brandModel[]) => {
            res.status(200).json(brands)
        })
    },

    getBrandFromName: (req: Request, res: Response) => {
        brandHelpers.brandFromName((req.query.brandName as string)).then((brand: brandModel) => {
            res.status(200).json(brand)
        })
    },

    getBrandFromId: (req: Request, res: Response) => {
        brandHelpers.brandFromId((req.query.brandId as string)).then((brand: brandModel) => {
            res.status(200).json(brand)
        })
    },

    getBrand: (req: Request, res: Response) => {
        if(req.query?.brandId){
            brandHelpers.brandFromId((req.query.brandId as string)).then((brand: brandModel) => {
                res.status(200).json(brand)
            })
        }else if(req.query.brandName){
            brandHelpers.brandFromName((req.query.brandName as string)).then((brand: brandModel) => {
                res.status(200).json(brand)
            })
        }else{
            res.status(400).json("Invalid Request")
        }
    },

    postAddBrand: async (req: Request, res: Response) => {
        if (req.body) {
            const result = await cloudinary.uploader.upload(req.file.path);
            const image = result.secure_url;
            req.body.image = image
            brandHelpers.addBrand(req.body).then((response) => {
                res.status(200).json("Done")
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },

    putUpdateBrand: async (req: Request, res: Response) => {
        if (req.body) {
            const result = await cloudinary.uploader.upload(req.file.path);
            const image = result.secure_url;
            if(image){
                req.body.image = image
            }
            brandHelpers.updateBrand(req.body).then((response) => {
                res.status(200).json("Done")
            })
        } else {
            res.status(400).json("Invalid Request")
        }
    },

    getProductsByBrand: (req: Request, res: Response) => {
        if(req.params.brand){
            brandHelpers.productByBrand(req.params.brand).then((products: productModel[]) => {
                res.status(200).json(products)
            })
        } else {
            throw new HttpException("Invalid Request", 400)
        }
    },
}