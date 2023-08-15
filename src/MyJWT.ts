import jwt from 'jsonwebtoken';
import { TokenUser, UserVO } from './Type';
import { JWT_SECRET } from './Secret';
import { Request, Response, NextFunction } from 'express';

export const tokenChacker =async (req:Request, res:Response, next:NextFunction) => {
    
    let token = extractToken(req);

    if(token != undefined){


        let decoedToken = decodeJWT(token);
        if(decoedToken != null){

            let {id, email, xp, name} = decodeJWT(token) as TokenUser;
            req.user = {id, email, exp:xp, name};


        }
        else{

            req.user = null;
        }


    }
    else{

        req.user = null;

    }

    next();

}

function extractToken(req:Request){

    const PREFIX = "Bearer";
    const auth = req.headers.authorization;
    const token = auth?.includes(PREFIX) ? auth.split(PREFIX)[1] : auth;
    return token;
}

export const createJWT =  (userVO:UserVO) => {

    const {id, email, name, exp} = userVO;
    const token = jwt.sign({id, email, name, xp:exp}, JWT_SECRET!, {expiresIn:'7 days'});

    return token;

}

export const decodeJWT = (token:string) => {

    try{

        const decodedToken = jwt.verify(token, JWT_SECRET!);
        return decodedToken;

    }
    catch(e){

        return null;

    }

}