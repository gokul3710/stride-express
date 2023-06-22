import { Request, Response } from 'express';
import { userModel as user, helperResponseModel } from '../../models/user-model';
import { generateAdminToken, generateUserToken, getUserFromToken } from '../../middlewares/jwt';
import { authRequest, filesRequest } from '../../models/request-model';
import userProfileHelpers from '../../helpers/user/user-profile-helpers';
import cloudinary from '../../config/cloudinary';

export default {

    getUserFromToken: (req: Request, res: Response) => {
        const user = getUserFromToken(req as authRequest);
        if (typeof user === 'string') {
            res.status(400).json({ 'error': user });
        } else {
            userProfileHelpers.getUser(user.userId.toString()).then((user)=>{
                if(user?.block){
                    res.status(401).json('User has been blocked')
                    return
                }
                res.status(200).json(user)
            })
        }
    },

    putEditUserImage: async(req: Request, res: Response) => {

        const result = await cloudinary.uploader.upload(req.file.path);
        const image = result.secure_url;

        userProfileHelpers.editImage(image, (req as authRequest).user.userId).then((response: helperResponseModel) => {
            if (response.status) {
                res.status(200).json({ image })
            } else {
                res.status(400).json("Image not updated")
            }
        })
    },

    putEditUsername: (req: authRequest, res: Response) => {
        if (req.body.username) {
            if ((req.body.username as string).length >= 5) {
                userProfileHelpers.editUsername(req.body.username, req.user.userId).then((response: helperResponseModel) => {
                    if (response.status) {
                        const user = (req as authRequest).user
                        user.username = req.body.username
                        const token = generateUserToken(user)
                        res.status(200).json({ token })
                    } else if (response.error) {
                        res.status(400).json(response)
                    }
                })
            } else {
                res.status(400).json({ "error": "Username should have atleast 5 characters" })
            }
        }
        else {
            res.status(400).json({ "error": "Username cannot be empty" })
        }
    },

    putEditEmail: (req: authRequest, res: Response) => {
        if (req.body.email) {
            if ((req.body.email.split("@")[0] as string).length >= 5) {
                userProfileHelpers.editEmail(req.body.email, req.user.userId).then((response: helperResponseModel) => {
                    if (response.status) {
                        const user = (req as authRequest).user
                        user.email = req.body.email
                        const token = generateUserToken(user)
                        res.status(200).json({ token })
                    } else if (response.error) {
                        res.status(404).json(response)
                    }
                })
            }
            else {
                res.status(400).json({ "error": "Enter a valid Email Address" })
            }
        }
        else {
            res.status(400).json({ "error": "Email Address cannot be empty" })
        }
    },

    putEditPhone: (req: authRequest, res: Response) => {
        if (req.body.phone) {
            if ((req.body.phone as string).length == 10) {
                userProfileHelpers.editPhone(req.body.phone, req.user.userId).then((response: helperResponseModel) => {
                    if (response.status) {
                        const user = (req as authRequest).user
                        user.phone = req.body.phone
                        const token = generateUserToken(user)
                        res.status(200).json({ token })
                    } else if (response.error) {
                        res.status(404).json(response)
                    }
                })
            }
            else {
                res.status(400).json({ "error": "Enter a valid Phone Number" })
            }
        } else {
            res.status(400).json({ "error": "Phone Number cannot be empty" })
        }

    },

    putEditDetails: (req: authRequest, res: Response) => {
        if (req.body) {
            userProfileHelpers.editDetails(req.body, req.user.userId).then((response: helperResponseModel) => {
                if (response.status) {
                    const user = (req as authRequest).user
                    user.firstName = req.body.firstName
                    user.lastName = req.body.lastName
                    const token = generateUserToken(user)
                    res.status(200).json({ token })
                } else {
                    res.status(400).json("Couldn't Update Details")
                }
            })
        }
    },

    postAddAddress: (req: authRequest, res: Response) => {
        if (req.body) {
            userProfileHelpers.addAddress(req.body, req.user.userId).then((response) => {
                res.status(200).json(response)
            })
        }
    },

    putEditAddress: (req: authRequest, res: Response) => {
        if (req.body) {
            userProfileHelpers.editAddress(req.body, req.user.userId).then((response) => {
                res.status(200).json(response)
            })
        }
    },

    deleteAddress: (req: authRequest, res: Response) => {
        if (req.params.addressId) {
            userProfileHelpers.deleteAddress(req.params.addressId, req.user.userId).then((response) => {
                res.status(200).json(response)
            })
        }
    },

    getAddress: (req: authRequest, res: Response) => {
        userProfileHelpers.address(req.user.userId).then((response) => {
            res.status(200).json(response)
        })
    },

    postSetDefaultAddress: (req: authRequest, res: Response) => {
        if (req.body) {
            userProfileHelpers.setDefaultAddress(req.body, req.user.userId).then((response) => {
                res.status(200).json(response)
            })
        }
    },

    putEditPassword: (req: authRequest, res: Response) => {
        if (req.body) {
            userProfileHelpers.changePassword(req.body, req.user.userId).then((response: helperResponseModel) => {
                if (response.status) {
                    res.status(200).json(response.response)
                } else {
                    res.status(400).json(response.error)
                }
            })
        }else{
            res.status(400).json('Bad Request')
        }
    },

    postUserSessionLogs: (req: authRequest, res: Response) => {
        if (req.body.logs) {
            userProfileHelpers.sessionLogs(req.body.logs, req.user.userId).then((response) => {
                if (response) {
                    res.status(200).json(response)
                } else {
                    res.status(400).json(response)
                }
            })
        }
    },
}