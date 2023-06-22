import { Request, Response } from 'express';
import productHelpers from '../../helpers/shop/product-helpers';
import { notificationModel, productModel } from '../../models/product-model';
import notificationHelpers from '../../helpers/shop/notification-helpers';
import { uploadFilesToCloudinary } from '../../config/cloudinary';

export default {
    getProducts: (req: Request, res: Response) => {
        productHelpers.allProducts().then((products: productModel[]) => {
            res.status(200).json(products)
        })
    },

    getProduct: (req: Request, res: Response) => {
        if (req.query?.productId) {
            productHelpers.product((req.query.productId) as string).then((product: productModel) => {
                res.status(200).json(product)

            })
        } else {
            res.status(404).json("Invalid Request")
        }
    },



    postAddProduct: async (req: Request, res: Response) => {
        
        let images: any = req.files
        images = images.map(image => image.path)

        let result = await uploadFilesToCloudinary(images) 
    
        req.body.images = result

        if (req.body) {
            const response: any = await productHelpers.addProduct(req.body)
            const notification: notificationModel = {
                image: req.body.images[0],
                title: `New Product`,
                description: `${response.brand} ${req.body.model}`,
                subDescription: 'Check It Now!!!',
                date: new Date(),
                product: response.insertedId
            }
            notificationHelpers.addNotification(notification).then((response) => {
                res.status(200).json(response)
            })
        } else {
            res.status(404).json("Invalid Request")
        }
    },

    deleteProduct: (req: Request, res: Response) => {
        if (req.body?.productId) {
            productHelpers.deleteProduct(req.body.productId).then((response) => {
                res.status(200).json(response)
            })
        } else {
            res.status(404).json("Invalid Request")
        }
    },

    putUpdateProduct: (req: Request, res: Response) => {
        if (req.body?._id) {
            productHelpers.updateProduct(req.body).then((product) => {
                res.status(200).json(product)
            })
        } else {
            res.status(404).json("Invalid Request")
        }
    },

    postSearchProducts: (req: Request, res: Response) => {
        if (req.body) {
            productHelpers.searchProducts(req.body.searchString).then((products) => {
                res.status(200).json(products)
            })
        } else {
            res.status(404).json("Invalid Request")
        }
    },

    putUpdateImages: async (req: Request, res: Response) => {

        let images: any = req.files
        images = images.map(image => image.path)
        
        let result = await uploadFilesToCloudinary(images) 
    
        if (req.body.productId) {
            productHelpers.updateImages(req.body.productId, result).then((response) => {
                res.status(200).json(response)
            })
        } else {
            res.status(404).json("Invalid Request")
        }
    },
}