# Stride Shopping Application Backend

This repository contains the backend code for the Stride Shopping Application. It is built using Node-Express and TypeScript.

## Installation

1. Clone the repository:


2. Install the dependencies:


3. Configure the environment variables:

- Add your api keys in src/constants/evironments.ts.
- Add the collections names in src/constants/collections.ts.
- Add domain information in src/constants/domains.ts.
- Or you can customise the folders.


4. Start the server:


The server will start running at `http://localhost:3000`.

## API Routes

The following are the available API routes provided by the backend:

### User Authentication

- `POST /signin` - User signin by credentials.
- `POST /signin/email` - User signin by email.
- `POST /signin/phone` - User signin by phone.
- `POST /signin/username` - User signin by username.

### OTP Verification

- `POST /otp/phone` - Send OTP to the user's phone.
- `GET /otp/email` - Send OTP to the user's email.

### User Signup

- `POST /signup` - User signup.
- `POST /signup/google` - User signup using Google.

### User Login

- `POST /login` - User login using credentials.
- `POST /login/email` - User login using email.
- `POST /login/username` - User login using username.
- `POST /login/phone` - User login using phone.
- `POST /login/google` - User login using Google.

### User Profile

- `POST /profile/edit/username` - Edit user's username.
- `POST /profile/edit/email` - Edit user's email.

### Product Management

- `GET /products` - Get all products.
- `GET /product` - Get a specific product.
- `POST /add-product` - Add a new product (requires admin authorization).
- `PUT /update-product` - Update a product (requires admin authorization).
- `PUT /update-images` - Update product images (requires admin authorization).
- `POST /delete-product` - Delete a product (requires admin authorization).

### Product Filtering and Search

- `POST /filter/:page` - Filter products based on criteria.
- `POST /search` - Search for products.

### Brand Management

- `GET /brands` - Get all brands.
- `GET /brands/brand` - Get a specific brand.
- `GET /brand/:brand` - Get products by brand.

### Banner Management

- `GET /banners` - Get all active banners.
- `GET /banners/banner` - Get a specific banner.
- `POST /banners/add` - Add a new banner (requires admin authorization).
- `POST /banners/delete` - Delete a banner (requires admin authorization).
- `POST /banners/update` - Update a banner (requires admin authorization).
- `POST /banners/banner/active` - Activate a banner (requires admin authorization).
- `POST /banners/banner/inactive` - Deactivate a banner (requires admin authorization).

### Admin Management

- `GET /` - Admin dashboard (requires admin authorization).
- `POST /login` - Admin login.
- `GET /users` - Get all users (requires admin authorization).
- `POST /users/user/block` - Block a user (requires admin authorization).
- `POST /users/user/unblock` - Unblock a user (requires admin authorization).
- `GET /coupons` - Get all coupons (requires admin authorization).
- `GET /coupons/coupon` - Get a specific coupon (requires admin authorization).
- `POST /coupons/add` - Add a new coupon (requires admin authorization).
- `POST /coupons/delete` - Delete a coupon (requires admin authorization).
- `POST /coupons/update` - Update a coupon (requires admin authorization).


## Contributing

Contributions to the Stride Shopping Application backend are welcome. If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

If you have any questions or need assistance, feel free to contact the project maintainer at gokulappooz@gmail.com
