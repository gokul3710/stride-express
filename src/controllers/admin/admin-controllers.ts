import { Request, Response } from 'express'
import { generateAdminToken } from '../../middlewares/jwt';
import adminHelpers from '../../helpers/admin/admin-helpers';
import { userModel } from '../../models/user-model';
import userAuthHelpers from '../../helpers/user/user-auth-helpers';
import { environments } from '../../constants/environments';

export default {

    updatePrice: (req: Request, res: Response) => {
        adminHelpers.updateprice().then((response)=>{
            res.status(200).json(response)
        })
    },

    postAdminLogin: (req: Request, res: Response) => {        

        if (req.body.email != environments.ADMIN_EMAIL) {
            res.status(404).json({ email:true, error: 'Wrong Email' })
            return
        }

        if (req.body.password != environments.ADMIN_PASSWORD) {
            res.status(404).json({password: true, error: 'Wrong Password' })
            return
        }

        const token: string = generateAdminToken()
        res.status(200).json(token)

    },

    admin: (req: Request, res: Response) => {
        res.status(200).json("hello admin")
    },

    getUsers: (req: Request, res: Response) => {
        adminHelpers.allUsers().then((users: userModel[]) => {
            res.status(200).json(users)
        })
    },

    putBlockUser: (req: Request, res: Response) => {
        if(req.params?.userId){
            userAuthHelpers.blockUser(req.params.userId).then((response) => {
                res.status(200).json(response)
            })
        }
        
    },

    putUnBlockUser: (req: Request, res: Response) => {
        if(req.params?.userId){
            userAuthHelpers.unBlockUser(req.params.userId).then((response) => {
                res.status(200).json(response)
            })
        }
        
    }

}