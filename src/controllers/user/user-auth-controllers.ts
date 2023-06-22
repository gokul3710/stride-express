import { Request, Response } from 'express';
import userHelpers from '../../helpers/user/user-auth-helpers'
import { helperResponseModel } from '../../models/user-model';
import { generateGoogleAuthToken, generateUserToken, getUserFromGoogleAuthToken } from '../../middlewares/jwt';
import { checkCredential } from '../../middlewares/user-auth';



export default {

    postSignInByCredential: (req: Request, res: Response) => {
        const state = checkCredential(req.body?.credential)
        if (state === "phone") {
            userHelpers.signinByPhone(req.body.credential).then((response) => {
                res.status(200).json({ state, response })
            })
        } else if (state === "email") {
            userHelpers.signinByEmail(req.body.credential).then((response) => {
                res.status(200).json({ state, response })
            })
        } else if (state === "username") {
            userHelpers.signinByUsername(req.body.credential).then((response) => {
                res.status(200).json({ state, response })
            })
        } else {
            res.status(404).json("Invalid Credential")
        }
    },

    postLoginByCredential: (req: Request, res: Response) => {
        const state = checkCredential(req.body?.credential)
        if (state === "phone") {
            userHelpers.loginByPhone({ phone: req.body.credential, password: req.body.password }).then((data: helperResponseModel) => {
                if (data.status) {
                    const token = generateUserToken(data.user)
                    res.status(200).json(token)
                } else {
                    res.status(400).json(data.error)
                }
            })
        } else if (state === "email") {
            userHelpers.loginByEmail({ email: req.body.credential, password: req.body.password }).then((data: helperResponseModel) => {
                if (data.status) {
                    const token = generateUserToken(data.user)
                    res.status(200).json(token)
                } else {
                    res.status(400).json(data.error)
                }
            })
        } else if (state === "username") {
            userHelpers.loginByUsername({ username: req.body.credential, password: req.body.password }).then((data: helperResponseModel) => {
                if (data.status) {
                    const token = generateUserToken(data.user)
                    res.status(200).json(token)
                } else {
                    res.status(400).json(data.error)
                }
            })
        } else {
            res.status(400).json("Invalid Credentials")
        }
    },

    postSignInByEmail: (req: Request, res: Response) => {
        userHelpers.signinByEmail(req.body.email).then((response) => {
            res.status(200).json({ status: "email", response })
        })
    },

    postSignInByPhone: (req: Request, res: Response) => {
        userHelpers.signinByPhone(req.body.phone).then((response) => {
            res.status(200).json({ status: "phone", response })
        })
    },

    postSignInByUsername: (req: Request, res: Response) => {
        userHelpers.signinByUsername(req.body.username).then((response) => {
            res.status(200).json({ status: "username", response })
        })
    },

    postSignup: (req: Request, res: Response) => {
        userHelpers.signup(req.body).then((data: helperResponseModel) => {
            if (data.status) {
                const token = generateUserToken(data.user)
                res.status(200).json(token)
            }
            else {
                res.status(400).json(data.error)
            }
        })
    },

    postSignupByGoogle: (req: Request, res: Response) => {        
        if (req.body) {
            const user = getUserFromGoogleAuthToken(req)
            if (typeof user === 'string') {
                res.status(400).json(user)
                return
            } else {
                user.phone = req.body.phone
                user.password = req.body.password
                user.gender = req.body.gender
            }

            userHelpers.signup(user).then((data: helperResponseModel) => {
                if (data.status) {
                    const token = generateUserToken(data.user)
                    res.status(200).json(token)
                }
                else {
                    res.status(400).json(data.error)
                }
            })

        }
    },

    postLoginByEmail: (req: Request, res: Response) => {
        userHelpers.loginByEmail(req.body).then((data: helperResponseModel) => {
            if (data.status) {
                const token = generateUserToken(data.user)
                res.status(200).json(token)
            } else {
                res.status(400).json(data.error)
            }
        })
    },

    postLoginByUsername: (req: Request, res: Response) => {
        userHelpers.loginByUsername(req.body).then((data: helperResponseModel) => {
            if (data.status) {
                const token = generateUserToken(data.user)
                res.status(200).json(token)
            } else {
                res.status(400).json(data.error)
            }
        })
    },

    postLoginByPhone: (req: Request, res: Response) => {
        userHelpers.loginByPhone(req.body).then((data: helperResponseModel) => {
            if (data.status) {
                const token = generateUserToken(data.user)
                res.status(200).json(token)
            } else {
                res.status(400).json(data.error)
            }
        })
    },

    postLoginByGoogle: (req: Request, res: Response) => {
        userHelpers.loginByGoogle(req.body).then((data: helperResponseModel) => {
            if (data.status) {
                if (data.state === "login") {
                    const token = generateUserToken(data.user)
                    res.status(200).json({ token, state: data.state })
                } else if (data.state === 'signup') {
                    const token = generateGoogleAuthToken(data.user)
                    res.status(200).json({ token, state: data.state })
                }
            } else {
                res.status(400).json("nope!")
            }
        })
    },

    postEmailOtp: (req: Request, res: Response) => {

    },

}