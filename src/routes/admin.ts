import { Router } from 'express';
import adminControllers from '../controllers/admin/admin-controllers';
import { authorizeAdmin } from '../middlewares/jwt';
import couponControllers from '../controllers/shop/coupon-controllers';
import brandControllers from '../controllers/shop/brand-controllers';
import userOrderControllers from '../controllers/user/user-order-controllers';
import bannerControllers from '../controllers/shop/banner-controllers';
import upload from '../config/multer';

const router = Router();

// router.get('/admin/admin/admin/admin', adminControllers.updatePrice)

router.get('/admin', authorizeAdmin, adminControllers.admin);

router.post('/admin/login', adminControllers.postAdminLogin);

// users

router.get('/admin/user', authorizeAdmin, adminControllers.getUsers);

router.patch('/admin/user/:userId/block', authorizeAdmin, adminControllers.putBlockUser);

router.patch('/admin/user/:userId/unblock', authorizeAdmin, adminControllers.putBlockUser);

// coupons

router.get('/admin/coupons', authorizeAdmin, couponControllers.getCoupons);

router.get('/admin/coupons/coupon', authorizeAdmin, couponControllers.getCouponFromId);

router.post('/coupon', authorizeAdmin, couponControllers.postAddCoupon);

router.delete('/coupon/:couponId', authorizeAdmin, couponControllers.deleteCoupon);

router.patch('/coupon/:couponId', authorizeAdmin, couponControllers.putUpdateCoupon);

// brands

router.get('/admin/brands', authorizeAdmin, brandControllers.getBrands);

router.get('/admin/brands/brand', authorizeAdmin, brandControllers.getBrand);

router.post('/brand', authorizeAdmin, upload.single('image'), brandControllers.postAddBrand);

router.post('/brand/:brandId', authorizeAdmin, couponControllers.deleteCoupon);

router.patch('/brand/:brandId', authorizeAdmin, upload.single('image'), brandControllers.putUpdateBrand);

// orders

router.get('/admin/orders', authorizeAdmin, userOrderControllers.getAllOrders);

router.post('/admin/order/change-status', authorizeAdmin, userOrderControllers.putChangeOrderStatus);

router.post('/admin/order/cancel', authorizeAdmin, userOrderControllers.putCancelOrder);

// banners

router.get('/admin/banners', authorizeAdmin, bannerControllers.getBanners);

router.get('/admin/banners/banner', authorizeAdmin, bannerControllers.getBanner);

router.post('/banner', authorizeAdmin, upload.single('image'), bannerControllers.postAddBanner);

router.delete('/banner/:bannerId', authorizeAdmin, couponControllers.deleteCoupon);

router.patch('/banner/:bannerId', authorizeAdmin, upload.single('image'), bannerControllers.putUpdateBanner);

router.patch('/banner/:bannerId/activate', authorizeAdmin, bannerControllers.putActivateBanner);

router.patch('/banner/:bannerId/inactivate', authorizeAdmin, bannerControllers.putInActivateBanner);

export default router;
