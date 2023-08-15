import {Router, Request, Response, NextFunction} from "express";
import { Pool } from "./DB";
import {RowDataPacket, ResultSetHeader} from "mysql2/promise"
import { MessageType, RankVO, ResponseMSG } from "./Type";
import { InventoryVO } from "./Type";

export const gameRouger = Router();

gameRouger.get("/game", async (req:Request, res:Response, next:NextFunction) => {

    if(req.user == null){

        res.json({type:MessageType.ERROR, message:"권한X"});
        return;

    }

    const user = req.user;

    let sql = "SELECT * FROM ranking ORDER BY score ASC LIMIT 0,3";
    let [rows, col]:[RowDataPacket[], any] = await Pool.query(sql, [user.id]);
    if(rows.length == 0)
    {
        res.json({type:MessageType.EMPTY, message:""});
    }else{

        let json = rows[0].json as string;
        let a:string = "";

        for(let i = 0; i < rows.length; i++){

            a += `${i + 1} : (name : ${(rows[i] as RankVO).memo}) ClearTime = ${(rows[i] as RankVO).score} \n`;

        }

        console.log(a);
        res.json({type:MessageType.SUCCESS, message:a});
    }

});

gameRouger.post("/game", async (req:Request, res:Response, next:NextFunction) => {

    if(req.user == null)
    {
        res.json({type:MessageType.ERROR, message:"권한이 없습니다."});
        return;
    }

    const user = req.user;
    let vo : RankVO = req.body;

    let[rows, cols]:[RowDataPacket[], any] = await Pool.query("INSERT INTO ranking(user_id, score, memo) VALUES (?, ?, ?)", [user.id, vo.score, vo.memo]);


});

