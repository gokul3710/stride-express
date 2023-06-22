import { Request, Response } from 'express';
import { notificationModel } from '../../models/product-model';
import notificationHelpers from '../../helpers/shop/notification-helpers';
import { authRequest, filesRequest } from '../../models/request-model';

export default {
    getNotifications: (req: Request, res: Response) => {
        notificationHelpers.allNotifications().then((notifications: notificationModel[]) => {
            res.status(200).json(notifications)
        })
    },

    postResetNotificationCount: (req: Request, res: Response) => {
        notificationHelpers.resetNotificationCount((req as authRequest).user.userId).then((response) => {
            res.status(200).json(response)
        })
    },

    postAddNotification: (req: Request, res: Response) => {
        if(req.body){
            const image = (req as filesRequest)?.files[0]?.filename
            req.body.image = image
            notificationHelpers.addNotification(req.body).then((response) => {
                res.status(200).json(response)
            })
        }else{
            res.status(404).json("Invalid Request")
        }
        
    },

    postClearNotification: (req: Request, res: Response) => {
        notificationHelpers.clearNotification((req as authRequest).user.userId).then((response) => {
            res.status(200).json(response)
        })
    },
}