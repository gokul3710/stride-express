import * as jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { userModel as user } from '../models/user-model';
import { authRequest } from '../models/request-model';
import { environments } from '../constants/environments';

const secret = environments.SECRET

export function generateUserToken(user: user): string {
    const payload = {
        userId: user._id
    };
    const options = {
        expiresIn: '30d'
    };
    return jwt.sign(payload, secret, options);
}

export function generateGoogleAuthToken(user: any): string {
    const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        email: user.email,
    };
    const options = {
        expiresIn: '1h'
    };
    return jwt.sign(payload, secret, options);
}

export function generateAdminToken(): string {
    const payload = {
        admin: true,
        random: Math.floor(Math.random() * 1000)
    };
    const options = {
        expiresIn: '30d'
    };
    return jwt.sign(payload, secret, options);
}

export const authorize = (req: authRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json("Authorization header not found");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json("Token not found");
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send("Invalid token");
    }
};

export const authorizeAdmin = (req: authRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json("Authorization header not found");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json("Token not found");
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.admin = decoded;
        if (req.admin?.admin) {
            next();
        } else {
            res.status(401).send("Unauthorized request");
        }
    } catch (error) {
        res.status(401).send("Invalid token");
    }
};

export const getUserFromToken = (req: authRequest): {userId: string} | string => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return "Authorization header not found";
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return "Token not found";
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        return decoded as {userId: string}
    } catch (error) {
        return "Invalid token";
    }
};

export function getUserFromGoogleAuthToken(req: any): any {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return "Authorization header not found";
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return "Token not found";
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        return decoded
    } catch (error) {
        return "Invalid token";
    }
}

