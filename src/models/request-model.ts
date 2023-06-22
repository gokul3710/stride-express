import { Request } from "express"

export interface authRequest extends Request{
    headers: {
        authorization: string
    }
    user: any
    admin: any
}

export interface filesRequest extends Request{
    files: any
}