import { Router} from 'express';
import productControllers from '../controllers/shop/product-controllers';
import {authorizeAdmin } from '../middlewares/jwt';
import productQueryControllers from '../controllers/shop/product-query-controllers';
import brandControllers from '../controllers/shop/brand-controllers';
import bannerControllers from '../controllers/shop/banner-controllers';
import upload from '../config/multer';

const router = Router();

router.get('/product',productControllers.getProducts)

router.get('/product/:productId', productControllers.getProduct)

router.post('/product', authorizeAdmin,upload.array('image'),productControllers.postAddProduct)

router.patch('/product/:productId', authorizeAdmin, productControllers.putUpdateProduct)

router.patch('/product/:productId/image', authorizeAdmin,upload.array('image'), productControllers.putUpdateImages)

router.delete('/product/:productId',authorizeAdmin, productControllers.deleteProduct)


//filter products
router.post('/product/filter/:page', productQueryControllers.postFilterProducts)

router.post('/product/search', productControllers.postSearchProducts)


//brands
router.get('/brand', brandControllers.getBrands)

router.get('/brand/:brandId', brandControllers.getBrand)

router.get('/products/brand/:brand', brandControllers.getProductsByBrand)


// banners
router.get('/banner/active', bannerControllers.getActiveBanners)





export default router;
