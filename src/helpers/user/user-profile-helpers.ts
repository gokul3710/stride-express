import { db } from '../../config/mongodb'
import { ObjectId } from 'mongodb'
import { generatePassword, comparePassword } from '../../middlewares/bcrypt';
import { collections } from '../../constants/collections';
import { userModel as user, userAddressModel as address, userModel, userAddressModel } from '../../models/user-model';
import { response } from 'express';

export default {

    getUser: (userId: string): Promise<userModel> => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_COLLECTION).findOne({_id: new ObjectId(userId)}).then((user: userModel)=>{
                resolve(user)
            })
        })
    },

    editImage: (imageUrl: string, userId: string) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_COLLECTION).updateOne({ _id: new ObjectId(userId) }, {
                $set: {
                    image: imageUrl
                }
            }).then((response) => {
                resolve({ status: true, response })
            })
        })
    },
    
    editUsername: (newUsername: string, userId: string) => {
        return new Promise(async (resolve, reject) => {
            const userByUsername = await db.get().collection(collections.USER_COLLECTION).findOne({ username: newUsername })
            const userByEmail = await db.get().collection(collections.USER_COLLECTION).findOne({ email: newUsername + '@gmail.com' })

            if (userByEmail) {
                if (userByEmail._id.toString() !== userId) {
                    resolve({ error: "Username is not available" })
                    return
                }
            }
            if (userByUsername) {
                if (userByUsername._id.toString() !== userId) {
                    resolve({ error: "Username is not available" })
                    return
                }
            }

            db.get().collection(collections.USER_COLLECTION).updateOne({ _id: new ObjectId(userId) }, {
                $set: {
                    username: newUsername
                }
            }).then((response) => {
                resolve({ status: true, response })
            })
        }
        )
    },

    editEmail: (newEmail: string, userId: string) => {
        return new Promise(async (resolve, reject) => {
            const userByUsername = await db.get().collection(collections.USER_COLLECTION).findOne({ username: newEmail.split("@")[0] })
            const userByEmail = await db.get().collection(collections.USER_COLLECTION).findOne({ email: newEmail })

            if (userByEmail || userByUsername) {
                resolve({ error: "Email is already registered" })
            } else {
                db.get().collection(collections.USER_COLLECTION).updateOne({ _id: new ObjectId(userId) }, {
                    $set: {
                        email: newEmail
                    }
                }).then((response) => {
                    resolve({ status: true, response })
                })
            }
        })
    },

    editPhone: (newPhone: string, userId: string) => {
        return new Promise(async (resolve, reject) => {
            const user = await db.get().collection(collections.USER_COLLECTION).findOne({ phone: newPhone })

            if (user) {
                if (user._id.toString() !== userId) {
                    resolve({ error: "Phone Number is already registered" })
                    return
                }
            }

            db.get().collection(collections.USER_COLLECTION).updateOne({ _id: new ObjectId(userId) }, {
                $set: {
                    phone: newPhone
                }
            }).then((response) => {
                resolve({ status: true, response })
            })

        })
    },

    editDetails: (userData: user, userId: string) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.USER_COLLECTION).updateOne({ _id: new ObjectId(userId) }, {
                $set: {
                    firstName: userData.firstName,
                    lastName: userData.lastName
                }
            }).then((response) => {
                resolve({ status: true, response })
            })
        })
    },

    editPassword: (newPassword: string, password: string, userId: string) => {
        return new Promise(async (resolve, reject) => {
            const user: user = await db.get().collection(collections.USER_COLLECTION).findOne({ _id: new ObjectId(userId) })
            const status: boolean = await comparePassword(password, user.password)
            if (status) {
                password = await generatePassword(newPassword)
                db.get().collection(collections.USER_COLLECTION).updateOne({ _id: new ObjectId(userId) }, {
                    $set: {
                        password: password
                    }
                }).then((response) => {
                    resolve({ status: true, response })
                })
            } else {
                resolve({ error: "Wrong Password" })
            }
        })
    },

    addAddress: (userAddress: address, userId: string) => {
        userAddress._id = new ObjectId()
        return new Promise(async (resolve, reject) => {
            const address = await db.get().collection(collections.ADDRESS_COLLECTION).findOne({ userId: new ObjectId(userId) })
            if (address) {
                userAddress.default = false
                db.get().collection(collections.ADDRESS_COLLECTION).updateOne({ userId: new ObjectId(userId) }, {
                    $push: {
                        addresses: userAddress
                    }
                }).then((response) => {
                    resolve(userAddress._id)
                })
            } else {
                userAddress.default = true
                db.get().collection(collections.ADDRESS_COLLECTION).insertOne({
                    userId: new ObjectId(userId),
                    addresses: [userAddress],
                }).then((response) => {
                    resolve(response)
                })
            }
        })
    },

    deleteAddress: (addressId: string, userId: string) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ADDRESS_COLLECTION).updateOne(
                { userId: new ObjectId(userId) },
                { $pull: { addresses: { _id: new ObjectId(addressId) } } }
            ).then(async (response) => {
                const address = await db.get().collection(collections.ADDRESS_COLLECTION).findOne({ userId: new ObjectId(userId) })
                resolve(address)
            })
        })
    },


    address: (userId: string) => {
        return new Promise(async (resolve, reject) => {
            const address = await db.get().collection(collections.ADDRESS_COLLECTION).findOne({ userId: new ObjectId(userId) })
            resolve(address)
        })
    },

    editAddress: (address: userAddressModel, userId: string) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.ADDRESS_COLLECTION).updateOne(
                { userId: new ObjectId(userId), 'addresses._id': new ObjectId(address._id) },
                {
                    $set: {
                        'addresses.$.name': address.name,
                        'addresses.$.phone': address.phone,
                        'addresses.$.house': address.house,
                        'addresses.$.street': address.street,
                        'addresses.$.city': address.city,
                        'addresses.$.state': address.state,
                        'addresses.$.pincode': address.pincode,
                        'addresses.$.landmark': address.landmark
                    }
                }
            ).then((response) => {
                resolve(response)
            })
        })
    },

    setDefaultAddress: (defaultAddress: { new: string, current: string }, userId: string) => {
        return new Promise(async (resolve, reject) => {
            const removeOlddefault = await db.get().collection(collections.ADDRESS_COLLECTION).updateOne(
                { userId: new ObjectId(userId), 'addresses._id': new ObjectId(defaultAddress.current) },
                {
                    $set: { 'addresses.$.default': false }
                }
            )

            const setNewDefault = await db.get().collection(collections.ADDRESS_COLLECTION).updateOne(
                { userId: new ObjectId(userId), 'addresses._id': new ObjectId(defaultAddress.new) },
                {
                    $set: { 'addresses.$.default': true }
                }
            )

            const address = await db.get().collection(collections.ADDRESS_COLLECTION).findOne({ userId: new ObjectId(userId) })

            resolve(address)
        })
    },

    changePassword: (passwords: { password: string, newPassword: string }, userId: string) => {
        return new Promise(async (resolve, reject) => {
            const user: user = await db.get().collection(collections.USER_COLLECTION).findOne({ _id: new ObjectId(userId) })
            if (user) {
                const status = await comparePassword(passwords.password, user.password)
                if (status) {
                    const password = await generatePassword(passwords.newPassword)
                    db.get().collection(collections.USER_COLLECTION).updateOne({ _id: new ObjectId(userId) }, {
                        $set: {
                            password: password
                        }
                    }).then((response) => {
                        resolve({ status: true, response })
                    })
                }
                else {
                    resolve({ error: "Wrong Password" })
                }
            } else {
                resolve({ error: 'User Not Found' })
            }
        })
    },

    sessionLogs: (logs: any, userId: string) => {
        const session = {
            user : new ObjectId(userId),
            logs
        }
        return new Promise(async (resolve, reject) => {
            db.get().collection(collections.SESSION_COLLECTION).insertOne(session).then(
                (response)=>{
                    resolve(response)
                }
            )
        })
    },
}