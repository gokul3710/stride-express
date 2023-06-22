import { Router } from 'express';
import { authorize } from '../middlewares/jwt';
import userProfileControllers from '../controllers/user/user-profile-controllers';
import userAuthControllers from '../controllers/user/user-auth-controllers';
import userCartControllers from '../controllers/user/user-cart-controllers';
import userOrderControllers from '../controllers/user/user-order-controllers';
import couponControllers from '../controllers/shop/coupon-controllers';
import notificationControllers from '../controllers/shop/notification-controllers';
import upload from '../config/multer';
import userWhishlistControllers from '../controllers/user/user-whishlist-controllers';

const router = Router();

// get user details
router.get('/user', authorize, userProfileControllers.getUserFromToken);

// user signin
router.post('/auth/signin', userAuthControllers.postSignInByCredential);

router.post('/user/signin/email', userAuthControllers.postSignInByEmail);
router.post('/user/signin/phone', userAuthControllers.postSignInByPhone);
router.post('/user/signin/username', userAuthControllers.postSignInByUsername);

//to send otp
router.post('/user/otp/phone', userAuthControllers.postEmailOtp);
router.get('/user/otp/email', userAuthControllers.postEmailOtp);

// user signup
router.post('/auth/signup', userAuthControllers.postSignup);
router.post('/auth/signup/google', userAuthControllers.postSignupByGoogle);

// user signin with Google
router.post('/auth/signin/google', userAuthControllers.postLoginByGoogle);

// user login
router.post('/auth/login', userAuthControllers.postLoginByCredential);
router.post('/user/login/email', userAuthControllers.postLoginByEmail);
router.post('/user/login/username', userAuthControllers.postLoginByUsername);
router.post('/user/login/phone', userAuthControllers.postLoginByPhone);

// user profile
router.patch('/user/profile', authorize, userProfileControllers.putEditDetails);
router.patch('/user/profile/username', authorize, userProfileControllers.putEditUsername);
router.patch('/user/profile/email', authorize, userProfileControllers.putEditEmail);
router.patch('/user/profile/phone', authorize, userProfileControllers.putEditPhone);
router.patch('/user/profile/image', authorize, upload.single('image'), userProfileControllers.putEditUserImage);
router.patch('/user/profile/password', authorize, userProfileControllers.putEditPassword);

// user address
router.post('/user/address', authorize, userProfileControllers.postAddAddress);
router.delete('/user/address/:addressId', authorize, userProfileControllers.deleteAddress);
router.patch('/user/address', authorize, userProfileControllers.putEditAddress);
router.post('/user/address/default', authorize, userProfileControllers.postSetDefaultAddress);
router.get('/user/address', authorize, userProfileControllers.getAddress);

// user cart
router.get('/user/cart', authorize, userCartControllers.getCartProducts);
router.post('/user/cart', authorize, userCartControllers.postAddToCart);
router.delete('/user/cart/:productId', authorize, userCartControllers.putRemoveFromCart);
router.get('/user/cart/total', authorize, userCartControllers.getCartTotal);
router.patch('/user/cart', authorize, userCartControllers.putChangeProductQuantity);

// user wishlist
router.get('/user/wihslist', authorize, userWhishlistControllers.getWishlistProducts);
router.post('/user/wishlist/add-to-wishlist', authorize, userWhishlistControllers.postAddToWishlist);
router.post('/user/wishlist/remove-from-wishlist', authorize, userWhishlistControllers.postRemoveFromWishlist);
router.get('/user/wishlist/count', authorize, userWhishlistControllers.getWishlistCount);

// user order
router.get('/user/order', authorize, userOrderControllers.getOrders);
router.get('/user/payment', authorize, userOrderControllers.getPayments);
router.post('/user/order', authorize, userOrderControllers.postPlaceOrder);
router.patch('/user/order/cancel', authorize, userOrderControllers.putCancelOrder);

router.post('/user/orders/order', authorize, userOrderControllers.postOrderDetails);
router.get('/user/orders/order/tracking', authorize, userOrderControllers.getOrders);
router.get('/user/orders/order/items', authorize, userOrderControllers.getOrders);


// coupon
router.patch('/user/coupon/add', authorize, couponControllers.postUseCoupon);
router.patch('/user/coupon/remove', authorize, couponControllers.putRemoveCouponFromCart);
router.get('/coupon/:couponCode', authorize, couponControllers.getCouponFromCode);

// notification
router.get('/notification', authorize, notificationControllers.getNotifications);
router.patch('/user/notification/reset', authorize, notificationControllers.postResetNotificationCount);
router.patch('/user/notification/clear', authorize, notificationControllers.postClearNotification);

// session log
router.post('/user/session', authorize, userProfileControllers.postUserSessionLogs);

export default router;
