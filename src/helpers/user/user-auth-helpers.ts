import { db } from '../../config/mongodb'
import { generatePassword, comparePassword } from '../../middlewares/bcrypt';
import { collections } from '../../constants/collections';
import { userSignupModel, userModel as user } from '../../models/user-model';
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb';


export default {
    signinByEmail: (email: string) => {
        return new Promise(async(resolve,reject)=>{
            const user =  await db.get().collection(collections.USER_COLLECTION).findOne({ email: email })
            if(user){
                resolve("login")
            }else{
                resolve("signup")
            }
        })
    },

    signinByPhone: (phone: string) => {        
        return new Promise(async(resolve,reject)=>{
            const user =  await db.get().collection(collections.USER_COLLECTION).findOne({ phone: phone })            
            if(user){
                resolve("login")
            }else{
                resolve("signup")
            }
        })
    },

    signinByUsername: (username: string) => {
        return new Promise(async(resolve,reject)=>{
            const user =  await db.get().collection(collections.USER_COLLECTION).findOne({ username: username })
            if(user){
                resolve("login")
            }else{
                resolve("signup")
            }
        })
    },

    signup: (userData: userSignupModel) => {
        return new Promise(async (resolve, reject) => {
            const userByEmail = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email })
            if (userByEmail) {
                resolve({ error: 'Email is already registered' })
            }

            const userByPhone = await db.get().collection(collections.USER_COLLECTION).findOne({ phone: userData.phone })
            if (userByPhone) {
                resolve({ error: 'Phone Number is already registered' })
            }

            const userByUsername = await db.get().collection(collections.USER_COLLECTION).findOne({ username: userData.email.split("@")[0] })
            if (userByUsername) {
                userData.username = userData.email.split("@")[0] + Math.floor(Math.random()*10000)
            }else{
                userData.username = userData.email.split("@")[0]
            }           

            if (!userByEmail && !userByPhone) {
                userData.password = await generatePassword(userData.password)
                if(!userData.image){
                    if(userData.gender === "Male"){
                        userData.image = "https://res.cloudinary.com/djep4papd/image/upload/v1684653271/73658623971098176-avatar_yap3rx.png"
                    }else if(userData.gender === "Female"){
                        userData.image = "https://res.cloudinary.com/djep4papd/image/upload/v1684653271/73152894782929282-avatar_t083fv.png"
                    }
                }
                userData.notifications = 0
                db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
                    resolve({ status: true, user: { ...userData, _id: data.insertedId } })
                })
            }
        })
    },

    loginByEmail: (userData: { email: string, password: string }) => {
        return new Promise(async (resolve, reject) => {
            const user: user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email })
            if(user.block){
                resolve({ error: 'User has been Blocked' })
                return
            }
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        resolve({ status: true, user })
                    }
                    else {
                        resolve({ error: "Wrong Password" })
                    }
                })
            } else {
                resolve({ error: 'Email is not registered' })
            }
        })
    },

    loginByUsername: (userData: { username: string, password: string }) => {
        return new Promise(async (resolve, reject) => {
            try{
                const user: user = await db.get().collection(collections.USER_COLLECTION).findOne({ username: userData.username })
                if(user.block){
                    resolve({ error: 'User has been Blocked' })
                    return
                }
                if (user) {
                    const status = await comparePassword(userData.password, user.password)
                    if (status) {
                        resolve({ status: true, user })
                    }
                    else {
                        resolve({ error: "Wrong Password" })
                    }
    
                } else {
                    resolve({ error: 'No user with the username' })
                }
            }
            catch{
                reject()
            }
        })
    },

    loginByPhone: (userData: { phone: string, password: string }) => {
        return new Promise(async (resolve, reject) => {
            try{
                const user: user = await db.get().collection(collections.USER_COLLECTION).findOne({ phone: userData.phone })
                if(user.block){
                    resolve({ error: 'User has been Blocked' })
                    return
                }
                if (user) {
                    const status = await comparePassword(userData.password, user.password)
                    if (status) {
                        resolve({ status: true, user })
                    }
                    else {
                        resolve({ error: "Wrong Password" })
                    }
    
                } else {
                    resolve({ error: 'No user with the username' })
                }
            }
            catch{
                reject()
            }
        })
    },

    loginByGoogle: (user)=>{
        return new Promise(async(resolve, reject)=>{
            const userByEmail = await db.get().collection(collections.USER_COLLECTION).findOne({ email: user.user.email })
            if(user.block){
                resolve({ error: 'User has been Blocked' })
                return
            }
            if (userByEmail) {
                resolve({state: 'login' ,status: true, user: userByEmail})
            }else{
                const newUser = {
                    email: user.user.email,
                    firstName: (user.user.displayName as string).split(' ')[0],
                    lastName: (user.user.displayName as string).split(' ')[1],
                    image: user.user.photoURL,
                    googleAuth: true
                }
                resolve({state: 'signup', status: true, user: newUser})
            }
        })
    },

    blockUser: (userId: string)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).updateOne({_id: new ObjectId(userId)},{
                $set:{
                    block: true
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },

    unBlockUser: (userId: string)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).updateOne({_id: new ObjectId(userId)},{
                $set:{
                    block: false
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    }
}
