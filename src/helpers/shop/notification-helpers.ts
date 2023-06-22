import { ObjectId } from 'mongodb';
import { db } from '../../config/mongodb'
import { collections } from '../../constants/collections';
import { notificationModel } from '../../models/product-model';

export default {

    allNotifications: (): Promise<notificationModel[]>=>{
        return new Promise(async(resolve,reject)=>{
            const notifications: notificationModel[] = await db.get().collection(collections.NOTIFICATION_COLLECTION).find().sort({ date: -1 }).toArray()
            resolve(notifications)
        })
    },

    resetNotificationCount: (userId: string) => {
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).updateOne({_id: new ObjectId(userId)},{
                $set:{
                    notifications: 0
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },

    addNotification: (notification: notificationModel)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.NOTIFICATION_COLLECTION).insertOne(notification).then((response)=>{
                db.get().collection(collections.USER_COLLECTION).updateMany({},{
                    $inc: {
                        notifications: 1
                    }
                }).then((response)=>{
                    resolve(response)
                })
            })
        })
    },


    clearNotification: (userId: string) => {
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).updateOne({_id: new ObjectId(userId)},{
                $set:{
                    notificationCleared: new Date()
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
}