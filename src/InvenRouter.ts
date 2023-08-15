import {Router, Request, Response, NextFunction} from "express";
import { Pool } from "./DB";
import {RowDataPacket, ResultSetHeader} from "mysql2/promise"
import { MessageType, ResponseMSG } from "./Type";
import { InventoryVO } from "./Type";

export const invenRouter = Router();

invenRouter.get("/inven", async (req:Request, res:Response, next:NextFunction) => {

    if(req.user == null){

        res.json({type:MessageType.ERROR, message:"권한X"});
        return;

    }   

    const user = req.user;

    let sql = "SELECT json FROM Inventorys WHERE user_id = ?";
    let [rows, col]:[RowDataPacket[], any] = await Pool.query(sql, [user.id]);
    if(rows.length == 0)
    {
        res.json({type:MessageType.EMPTY, message:""});
    }else{
        let json = rows[0].json as string;
        res.json({type:MessageType.SUCCESS, message:json});
    }
});

invenRouter.post("/inven", async (req:Request, res:Response, next:NextFunction) => {

    if(req.user == null)
    {
        res.json({type:MessageType.ERROR, message:"권한이 없습니다."});
        return;
    }

    const user = req.user;
    let vo : InventoryVO = req.body;

    let[rows, cols]:[RowDataPacket[], any] = await Pool.query("SELECT * FROM NewInven WHERE user_id = ?", [user.id]);
    let bindArr = [];

    if(rows.length == 0){

        let insertSQL = `INSERT INTO NewInven(user_id, slot_number, item_code, count) VALUES `;

        for(let i = 0; i < vo.count; i++){

        insertSQL += i == vo.count - 1 ? `(?, ?, 0, 0)` : `(?, ?, 0, 0), `;
        bindArr.push(user.id);
        bindArr.push(i);

    }
    let [result, info] : [ResultSetHeader, any] = await Pool.execute(insertSQL, bindArr);

    }
    else {
        let updateSQL = "UPDATE NewInven SET item_code = 0, count = 0 WHERE user_id = ?";
        await Pool.execute(updateSQL, [user.id]); //해당 유저의 인벤을 비우고
    }
        
    //그게 다 끝났으면 json을 돌면서 인벤토리를 업데이트를 해주면 된다.
    let updateSQL = "UPDATE NewInven SET item_code = ?, count = ? WHERE slot_number = ? AND user_id = ?";
    for(let i = 0 ; i < vo.list.length; i++)
    {
        const item = vo.list[i];
        await Pool.execute(updateSQL, [item.itemCode, item.count, item.slotNumber, user.id]);
    }

    const sql = `INSERT INTO Inventorys (user_id, json) VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE json = VALUES(json)`;
let [result, info] : [ResultSetHeader, any] = await Pool.execute(sql, [user.id, JSON.stringify(vo)]);

let msg: ResponseMSG = {type:MessageType.SUCCESS, message:"인벤토리 저장완료"};
res.json(msg);

});

