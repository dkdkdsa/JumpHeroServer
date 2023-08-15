import {Router, Request, Response} from "express";
import { Pool } from "./DB";
import {RowDataPacket, ResultSetHeader} from "mysql2/promise"
import { MessageType, ResponseMSG, UserVO } from "./Type";
import { createJWT } from "./MyJWT";

export const userRouter = Router();

userRouter.get("/user/login", async (req:Request, res:Response) => {


});

userRouter.get("/user", async (req:Request, res:Response) => {

    let resMsg : ResponseMSG = {type:MessageType.EMPTY, message:"로그인"};

    if(req.user != null){

        console.log(req.user);
        resMsg = {type:MessageType.SUCCESS, message:JSON.stringify(req.user)};
        res.json(resMsg);

    }
    else{

        res.json(resMsg);

    }

});

userRouter.post("/user/login", async (req:Request, res:Response) => {

    let {email:inputEmail, password}:{email:string, password:string} = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = PASSWORD(?)";

    let [row, col]:[RowDataPacket[], any] = await Pool.execute(sql, [inputEmail, password]);

    if(row.length == 0){

        res.json({type:MessageType.ERROR, message: "Error"});
        return;

    }

    let {id, email, name, exp} = row[0];
    let user: UserVO = {id, email, name, exp};
    let token = createJWT(user);

    res.json({type:MessageType.SUCCESS, message:JSON.stringify({token, user})});
    //console.log(user);

});

userRouter.get("/user/register", async (req:Request, res:Response) => {

    res.render("register");

});

userRouter.post("/user/register", async (req:Request, res:Response) => {

    console.log(req.body);

    let email:string = req.body.email;
    let password:string = req.body.password;
    let passwordc:string = req.body.passwordc;
    let username:string = req.body.username;

    if(email == "" || password == "" || username == ""){

        let msg:ResponseMSG = {type:MessageType.ERROR, message:"필수값 ㄴㄴ"};
        res.json(msg);
        return;

    }

    if(password != passwordc){

        let msg:ResponseMSG = {type:MessageType.ERROR, message:"비번 이상함"};
        res.json(msg);
        return;

    }

    const sql:string = "INSERT INTO users(email, password, name) VALUES(?, PASSWORD(?), ?)";

    let [result, info]:[ResultSetHeader, any] = await Pool.execute(sql, [email, password, username]);

    if(result.affectedRows != 1){

        let msg:ResponseMSG = {type:MessageType.ERROR, message:"ERROR!"};
        res.json(msg);
        return;

    }

    let msg:ResponseMSG = {type:MessageType.SUCCESS, message:"가입됨"};
    res.json(msg);

});